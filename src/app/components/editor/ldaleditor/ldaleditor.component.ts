import { query } from '@angular/animations';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  ViewEncapsulation,
  EventEmitter,
  Output,
} from '@angular/core';
import * as ace from 'ace-builds';
import { ComposerBackendService } from 'src/app/services/composer-backend.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { addQueryResult } from 'src/app/store/nft-state-store/nft.actions';

@Component({
  selector: 'app-ldaleditor',
  templateUrl: './ldaleditor.component.html',
  styleUrls: ['./ldaleditor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LdaleditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') private editor: any;
  @Input() id: string;
  @Input() type: string;
  @Input() query: string = '';
  @Output() onQuerySuccess: EventEmitter<any> = new EventEmitter();
  text: string = '';
  staticWordCompleter: any;
  aceEditor: ace.Ace.Editor;
  loading: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  queryRes = false;
  res: any;
  showOutput: boolean = false;
  jsonString = '';
  jsonPretty: any = '// No Output';
  newResults: boolean = false;
  keyWordList2: any = [
    'If',
    'FilterSubtree',
    'While',
    'LeftSibling',
    'RightSibling',
    'SetValue',
    'SetLValue',
    'SetRValue',
    'SetType',
    'SetNature',
    'SetCustomString',
    'SetMinimumChildWeight',
    'SetMaximumChildWeight',
    'SetWeight',
    'ReadFromFile',
    'IsType',
    'IsValue',
    'IsStringEqualTo',
    'IsStringMemberOf',
    'IsHavingSubstring',
    'IsHavingLeftSubstring',
    'IsHavingRightSubstring',
    'AddPrefix',
    'AddPostFix',
    'TrimLeft',
    'TrimRight',
    'WriteToFile',
    'IsIntEqualTo',
    'IsIntMemberOf',
    'IsLessThan',
    'IsLessThanOrEqualTo',
    'IsGreaterThan',
    'IsGreaterThanOrEqualTo',
    'IsNull',
    'IsNotNull',
  ];
  keyWordList: any = [
    // 'FilterSubtree',
    '$RESULT',
    'TRUE',
    'IfNot',
    'RET',
    'ARG',
    'EndFunction',
    'Break',
    'Item',
    'Function',
    'EndFunction',
    'FALSE',
    'Do',
    // 'While',
    'EndIf',
    'IfNot',

    ' Break',
    'Continue',
    // 'LeftSibling',
    // 'RightSibling',
    'Parent',
    'FirstChild',
    'Children',
    'ChildCount',
    'GetValue',
    'GetLValue',
    'GetRValue',
    'GetCustomString',
    'GetId',
    'GetType',
    'GetNature',
    'GetWeight',
    'GetMinimumChildWeight',
    'GetMaximumChildWeight',
    // 'SetValue',
    // 'SetLValue',
    // 'SetRValue',
    // 'SetType',
    // 'SetNature',
    // 'SetCustomString',
    // 'SetMinimumChildWeight',
    // 'SetMaximumChildWeight',
    // 'SetWeight',
    'Expand',
    'AddNode',
    'AddNodeWithWeight',
    // 'ReadFromFile',
    'GetAggregatedValue',
    'GetSubtree',
    // 'IsType',
    // 'IsValue',
    'GetChildOfType',
    // 'IsStringEqualTo',
    // 'IsStringMemberOf',
    // 'IsHavingSubstring',
    // 'IsHavingLeftSubstring',
    // 'IsHavingRightSubstring',
    // 'AddPrefix',
    // 'AddPostFix',
    // 'TrimLeft',
    // 'TrimRight',
    // 'WriteToFile',
    'GetLength',
    // 'IsIntEqualTo',
    // 'IsIntMemberOf',
    // 'IsLessThan',
    // 'IsLessThanOrEqualTo',
    // 'IsGreaterThan',
    // 'IsGreaterThanOrEqualTo',
    'Add',
    'Subtract',
    'ToString',
    'GetItemCount',
    'Seek',
    'SeekToBegin',
    'SeekToEnd',
    'GetCurrentElement',
    // 'IsNull',
    // 'IsNotNull',
    'And',
    'Or',
    'MaskValue',
    'MaskLogdata',
    'SetAttributes',
    '(FORMATTED_NUMBER)',
    '(TEXT)',
    '(NUMBER)',
    '(STRING)',
    '(SPACES)',
    '(FLOAT)',
    '(FORMATTED_FLOAT)',
    'SEQUENCE',
    'Ignore_Empty_Lines',
    'Number_Format_Is_European',
    'IGNORE_TEXT_BLOCK',
    'SetEntityObject',
    'GetEntityObject',
    'SecondsToMonths',
    'SecondsToDays',
    'SecondsToYears',
    'GetDifferenceByString',
    'StringToReadableDateTime',
    'DateNow',
    'StringToUnixTime',
    'GetNextElement',
    'CheckNotNull',
    'GetUniqueNodeListWithCount',
    'StringToInteger',
    'GetStringVar',
    'GetIntegerVar',
    'StringToBoolean',
    'GetComma',
    'GetBooleanVar',
    'SetBoolean',
    'ToFalse',
    'ToTrue',
    'NextSibling',
    'SortNodeList',
    'ExtractNodeListTop',
    'GetCustomObj',
    'ConvertToSentenceCase',
    'GetDayOfTheWeekShortString',
    'GetDayString',
    'GetMonthShortString',
    'GetTime24HourFormat',
    'GetYear',
    'GetOldestDate',
    'GetLatestDate',
    'AddPeriod',
  ];

  constructor(
    private apiService: ComposerBackendService,
    private _snackBar: MatSnackBar,
    private store: Store
  ) {}

  ngAfterViewInit(): void {
    this.setLanguageTools();
  }

  ngOnInit(): void {
    this.setWordCompleter(this.keyWordList, this.keyWordList2);
  }

  private setLanguageTools(): void {
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.session.setValue('');
    this.aceEditor.completers = [this.staticWordCompleter];
    this.aceEditor.setTheme('ace/theme/dracula');
    this.aceEditor.session.setMode('ace/mode/tql');

    this.aceEditor.setOptions({
      showLineNumbers: true,
      tabSize: 2,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      fontSize: '15px',
    });
    this.aceEditor.session.setValue(this.query);
    this.aceEditor.on('change', () => {
      this.query = this.aceEditor.getValue();
    });
  }

  private setWordCompleter(wordList: any, wordList2: any): void {
    this.staticWordCompleter = {
      getCompletions: function (
        editor: any,
        session: any,
        pos: any,
        prefix: any,
        callback: (
          arg0: null,
          arg1: { caption: string; value: string; meta: string }[]
        ) => void
      ) {
        callback(
          null,
          wordList2.map(function (word: any) {
            return {
              caption: word,
              value: word + '()',
              meta: 'keyword',
            };
          })
        );
        callback(
          null,
          wordList.map(function (word: any) {
            return {
              caption: word,
              value: word,
              meta: 'keyword',
            };
          })
        );
      },
    };
  }

  public openSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 5 * 1000,
    });
  }

  private saveExecuter() {
    if (!!this.res && !!this.res.Response.result) {
      this.store.dispatch(
        addQueryResult({
          queryResult: {
            WidgetId: this.id,
            queryResult: this.res.Response.result,
          },
        })
      );
      this.openSnackBar('Query Saved!!');
    } else {
      this.openSnackBar('Invalid query result formate');
    }
  }

  public queryExecuter() {
    this.loading = true;
    let queryObject = {
      WidgetId: this.id,
      Query: this.query,
    };

    this.apiService.executeQueryAndUpdate(queryObject).subscribe({
      next: (result: any) => {
        if (result) {
          //get result

          this.loading = false;
          this.res = result;
          this.checkOutput();
        }
      },
      error: (err) => {
        this.loading = false;
        alert('An unexpected error occured. Please try again later');
      },
      complete: () => {
        this.queryRes = true;
      },
    });
  }

  private checkOutput() {
    //{"type": 4, "val": {"ChartData":[{"Name":"averageAnnualTemperature","Value":"24"}]}} - charts
    //{"type": 4, "val": {"MainTable":[{"Farm Name":"Medathennawaththa","Temperature":"24","Humidity":"80%","Rainfall":"1800 mm"}]}} - table

    let output = this.res.Response.result;
    let outputObject = JSON.stringify(output);
    console.log(outputObject);
    let data = eval(outputObject);
    let result = JSON.parse(data);
    if (this.type === 'bar' || this.type === 'pie') {
      if (
        result['val'] !== undefined &&
        result.val['ChartData'] !== undefined &&
        result.val['ChartData'].length > 0 &&
        Object.keys(result.val['ChartData'][0]).includes('Name') &&
        Object.keys(result.val['ChartData'][0]).includes('Value')
      ) {
        console.log('valid');
        this.onQuerySuccess.emit({
          data: result.val['ChartData'],
        });
        this.saveExecuter();
      } else {
        this.openSnackBar('Invalid output. Please check the query.');
      }
    } else if (this.type === 'bubble') {
      if (
        result['val'] !== undefined &&
        result.val['ChartData'] !== undefined &&
        result.val['ChartData'].length > 0 &&
        Object.keys(result.val['ChartData'][0]).includes('Name') &&
        Object.keys(result.val['ChartData'][0]).includes('Value') &&
        Object.keys(result.val['ChartData'][0]).includes('X') &&
        Object.keys(result.val['ChartData'][0]).includes('Y')
      ) {
        console.log('valid');
        this.onQuerySuccess.emit({
          data: result.val['ChartData'],
        });
        this.saveExecuter();
      } else {
        this.openSnackBar('Invalid output. Please check the query.');
      }
    } else if (this.type === 'table') {
      if (
        result['val'] !== undefined &&
        result.val['MainTable'] !== undefined &&
        result.val.MainTable.length > 0
      ) {
        this.onQuerySuccess.emit({
          data: result.val.MainTable,
        });
        this.saveExecuter();
      } else {
        this.openSnackBar('Invalid output. Please check the query.');
      }
    } else {
      this.openSnackBar('Invalid output. Please check the query.');
    }

    this.outputJson(data);
    this.newResults = true;
  }

  public outputJson(data: any) {
    this.jsonPretty = JSON.stringify(JSON.parse(data), null, 2);
  }

  public toggleOutput() {
    this.showOutput = !this.showOutput;
    this.newResults = false;
  }
}
