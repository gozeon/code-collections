import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { AccordionItemComponent } from '../accordion-item/accordion-item.component';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent implements AfterContentInit {
  @ContentChildren(AccordionItemComponent) groups: QueryList<AccordionItemComponent>;

  /**
   * Invoked when all children (groups) are ready
   */
  ngAfterContentInit() {
    // console.log (this.groups);
    // Set active to first element
    this.groups.toArray()[0].opened = true;
    // Loop through all Groups
    this.groups.toArray().forEach((t) => {
      // when title bar is clicked
      // (toggle is an @output event of Group)
      t.toggle.subscribe(() => {
        // Open the group
        this.openGroup(t);
      });
      /*t.toggle.subscribe((group) => {
        // Open the group
        this.openGroup(group);
      });*/
    });
  }

  /**
   * Open an accordion group
   * @param group   Group instance
   */
  openGroup(group: any) {
    // close other groups
    this.groups.toArray().forEach((t) => t.opened = false);
    // open current group
    group.opened = true;
  }

}
