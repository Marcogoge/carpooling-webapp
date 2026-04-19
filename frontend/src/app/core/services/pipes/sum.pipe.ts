import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'sum', standalone: true })
export class SumPipe implements PipeTransform {
transform(array: any[], field: string): number {
if (!array) return 0;
return array.reduce((acc, item) => acc + (item[field] || 0), 0);
}
}
