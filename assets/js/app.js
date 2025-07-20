/** 
 * This file is part of the Sonata Project package.
 *
 * (c) Thomas Rabaix <thomas.rabaix@sonata-project.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// Any SCSS/CSS you require will output into a single css file (app.css in this case)
import '../scss/app.scss';

// Require jQuery normally
import $ from 'jquery';

import 'admin-lte/dist/js/adminlte.min';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/sortable';
import 'waypoints/lib/noframework.waypoints';
import 'waypoints/lib/shortcuts/sticky';
import 'readmore-js';
import 'jquery-form';
import 'icheck';
import 'jquery.scrollto';
import 'masonry-layout';
import 'bootstrap';
import 'select2/dist/js/select2.min';
// SonataAdmin custom scripts
import './admin';
import './treeview';
import './sidebar';
import './base';
import * as stimulus from '@hotwired/stimulus';

import { sonataApplication } from './stimulus';

// Create global variables to be used outside this script
global.$ = $;
global.jQuery = $;
global.stimulus = stimulus;
global.sonataApplication = sonataApplication;
