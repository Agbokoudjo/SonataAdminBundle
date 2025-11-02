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

namespace Sonata\AdminBundle\Util;


use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

/**
 * @template T
 */
final class IterableToCollection
{
    /**
     * Transforme n'importe quel `iterable` en `Collection`.
     *
     * @param iterable<mixed, T> $value
     * @return Collection<array-key, T>
     */
    public static function transform(iterable $value): Collection
    {
        if ($value instanceof \Traversable) {
            return new ArrayCollection(iterator_to_array($value));
        }

        if (is_array($value)) {
            return new ArrayCollection($value);
        }
        return $value;
    }
}
