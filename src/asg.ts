import { module, IModule } from 'angular';
import { asgBytesFilter } from './asg-bytes';
import { asgControlComponent } from './asg-control';
import { asgService } from './asg-service';
import { asgImageComponent } from './asg-image';
import { asgInfoComponent } from './asg-info';
import { asgModalComponent } from './asg-modal';
import { asgPanelComponent } from './asg-panel';
import { asgThumbnailComponent } from './asg-thumbnail';

export const moduleName = 'angularSuperGallery';

export const app: IModule = module(moduleName, [
	'ngAnimate',
	'ngTouch'
]);
app.filter('asgBytes', asgBytesFilter);
app.component('asgControl', asgControlComponent);
app.service('asgService', asgService);
app.component('asgImage', asgImageComponent);
app.component('asgInfo', asgInfoComponent);
app.component('asgModal', asgModalComponent);
app.component('asgPanel', asgPanelComponent);
app.component('asgThumbnail', asgThumbnailComponent);

