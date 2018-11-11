import { NgModule } from '@angular/core';
import { NotebooksByIdTitlePipe } from './notebooks-by-id-title/notebooks-by-id-title';
import { SampleByIdTitlePipe } from './sample-by-id-title/sample-by-id-title';

@NgModule({
	declarations: [NotebooksByIdTitlePipe, SampleByIdTitlePipe],
	imports: [],
	exports: [NotebooksByIdTitlePipe, SampleByIdTitlePipe]
})
export class PipesModule {}
