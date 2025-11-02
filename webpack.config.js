/*!
 * This file is part of the Sonata Project package.
 *
 * (c) Thomas Rabaix <thomas.rabaix@sonata-project.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

const Encore = require('@symfony/webpack-encore');

Encore
    // Dossier où les assets compilés seront stockés
    .setOutputPath('./src/Resources/public')
    .setPublicPath('/bundles/sonataadmin') // pour Sonata Admin, souvent './' ou '/bundles/sonataadmin'
    .setManifestKeyPrefix('bundles/sonataadmin')

    // Nettoyer le dossier de build avant compilation
    .cleanupOutputBeforeBuild()
    .disableSingleRuntimeChunk()

    // Sass / PostCSS minimal
    .enableSassLoader()
    .enablePostCssLoader()
    // Versioning / Source maps simplifiés
    .enableVersioning(false)
    .enableSourceMaps(false)

    // Fournir jQuery globalement (AdminLTE en dépend)
    .autoProvidejQuery()

    // Stimulus minimal
    .enableStimulusBridge('./assets/js/controllers.json')

    // Minimisation CSS / JS simplifiée
    .configureCssMinimizerPlugin((options) => {
        options.minimizerOptions = {
            preset: ['default', { discardComments: { removeAll: true } }],
        };
    })
    .configureTerserPlugin((options) => {
        options.terserOptions = { output: { comments: false } };
        options.extractComments = false;
    })

    // Règles pour images / fonts
    .configureImageRule({ filename: 'images/[name][ext]' })
    .configureFontRule({ filename: 'fonts/[name][ext]' })

    // Copier uniquement les fichiers nécessaires
    .copyFiles([
        { from: './assets/images/', pattern: /\.(png|gif)$/, to: 'images/[name].[ext]' },
        { from: './node_modules/select2/dist/js/i18n/', pattern: /\.js/, to: 'select2-locale/[name].[ext]' },
    ])

    // Entrée principale
    .addEntry('app', './assets/js/app.js');

// Exporter la config finale
module.exports = Encore.getWebpackConfig();