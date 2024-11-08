import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'replaceComma'  
})

export class ReplaceComma implements PipeTransform {
    transform(value: string|null): string {
        if (!!value) { // value ni undefined ni null 
            return value.replace(/,/g, '.');
        } else {
            return '';
        }
    }

}