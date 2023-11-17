import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.less']
})
export class MessageDialogComponent implements OnInit {

	content: string = this.config.data?.content;
	success: boolean = this.config.data?.success;
	
  constructor(private config: DynamicDialogConfig,
							private ref: DynamicDialogRef) { }

  ngOnInit(): void {
		
  }
	
	closeDialog(): void {
		this.ref.close();
	}

}
