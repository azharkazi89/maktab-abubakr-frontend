import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <div class="pagination">
      <button (click)="prev()" [disabled]="currentPage === 0">Prev</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button (click)="next()" [disabled]="currentPage === totalPages">Next</button>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();

  prev() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  next() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }
}
