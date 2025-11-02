<?php

declare(strict_types=1);

/*
 * This file is part of the Sonata Project package.
 *
 * (c) Thomas Rabaix <thomas.rabaix@sonata-project.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Sonata\AdminBundle\Form\DataTransformer;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Sonata\AdminBundle\Model\ModelManagerInterface;
use Symfony\Component\Form\DataTransformerInterface;
use Symfony\Component\Form\Exception\InvalidArgumentException;
use Symfony\Component\Form\Exception\TransformationFailedException;
use Symfony\Component\Form\Exception\UnexpectedTypeException;

/**
 * Transform object to ID and property label.
 *
 * @author Andrej Hudec <pulzarraider@gmail.com>
 *
 * @phpstan-template T of object
 * @phpstan-template P of non-empty-string|non-empty-string[]
 * @phpstan-implements DataTransformerInterface<T|array<T>|\Traversable<T>, int|string|array<int|string|array<string>>>
 */
final class ModelToIdPropertyTransformer implements DataTransformerInterface
{
    /**
     * @var callable|null
     *
     * @phpstan-var null|callable(T, P): string
     */
    private $toStringCallback;

    /**
     * @param string|string[] $property
     *
     * @phpstan-param ModelManagerInterface<T> $modelManager
     * @phpstan-param class-string<T> $className
     * @phpstan-param P $property
     * @phpstan-param null|callable(T, P): string $toStringCallback
     */
    public function __construct(
        private ModelManagerInterface $modelManager,
        private string $className,
        private $property,
        private bool $multiple = false,
        ?callable $toStringCallback = null,
    ) {
        if ('' === $property) {
            throw new InvalidArgumentException('The property must be non empty.');
        }

        $this->toStringCallback = $toStringCallback;
    }

    /**
     * @param int|string|array<int|string|array<string>>|null $value
     *
     * @throws \UnexpectedValueException
     *
     * @return Collection<int|string, object>|object|null
     *
     * @phpstan-param int|string|array<int|string|array<string>>|null $value
     * @psalm-param int|string|(array{_labels?: array<string>}&array<int|string>)|null $value
     * @phpstan-return Collection<array-key, T>|T|null
     */
    public function reverseTransform($value): ?object
    {
        if (null === $value || [] === $value || '' === $value) {
            if ($this->multiple) {
                return new ArrayCollection();
            }

            return null;
        }

        if (!$this->multiple) {
            if (\is_array($value)) {
                throw new UnexpectedTypeException($value, 'int|string');
            }

            return $this->modelManager->find($this->className, $value);
        }

        if (!\is_array($value)) {
            throw new UnexpectedTypeException($value, 'array');
        }

        unset($value['_labels']);

        return (new ModelsToArrayTransformer($this->modelManager, $this->className))->reverseTransform($value);
    }

    /**
     * @param object|array<object>|\Traversable<object>|null $value
     *
     * @throws \InvalidArgumentException
     *
     * @return array<string|int, string|array<string>>
     *
     * @phpstan-param T|array<T>|\Traversable<T>|null $value
     * @phpstan-return array<string|array<string>>
     * @psalm-return array{_labels?: array<string>}&array<string>
     */
    public function transform($value): array
    {
        if (null === $value) {
            return ['ids' => [], 'labels' => []];
        }

        $collection = [];

        if ($this->multiple) {
            if (!\is_array($value) && substr($value::class, -1 * \strlen($this->className)) === $this->className) {
                throw new InvalidArgumentException(
                    'A multiple selection must be passed a collection, not a single value.'
                        . ' Ensure "multiple=true" is set for many-to-many or one-to-many relations.'
                );
            }
            if (is_iterable($value)) {
                $collection = $value;
            } else {
                throw new InvalidArgumentException('Expected iterable value for multiple selection.');
            }
        } else {
            if (!\is_array($value) && substr($value::class, -1 * \strlen($this->className)) === $this->className) {
                $collection = [$value];
            } elseif (is_iterable($value)) {
                throw new InvalidArgumentException(
                    'A single selection must be passed a single object, not a collection.'
                        . ' Ensure "multiple=false" is set for many-to-one relation.'
                );
            } else {
                $collection = [$value];
            }
        }

        $ids = [];
        $labels = [];

        /** @phpstan-var array<T>|\Traversable<T> $collection */
        foreach ($collection as $model) {
            $id = $this->modelManager->getNormalizedIdentifier($model);
            if (null === $id) {
                throw new TransformationFailedException(sprintf(
                    'No identifier was found for the model "%s".',
                    $this->className
                ));
            }

            if (null !== $this->toStringCallback) {
                $label = ($this->toStringCallback)($model, $this->property);
            } elseif ($model instanceof \Stringable) {
                $label = $model->__toString();
            } else {
                throw new TransformationFailedException(sprintf(
                    'The model %s must have a "__toString()" method.',
                    $this->className
                ));
            }

            $ids[] = $id;
            $labels[] = $label;
        }

        return [
            'ids' => $ids,
            'labels' => $labels,
        ];
    }
}
