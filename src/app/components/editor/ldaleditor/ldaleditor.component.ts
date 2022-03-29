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

@Component({
  selector: 'app-ldaleditor',
  templateUrl: './ldaleditor.component.html',
  styleUrls: ['./ldaleditor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LdaleditorComponent implements OnInit, AfterViewInit {
  @ViewChild('editor') private editor: any;
  @Input() id: string;
  @Output() onQuerySuccess: EventEmitter<any> = new EventEmitter();
  text: string = '';
  staticWordCompleter: any;
  aceEditor: any;
  loading: boolean = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  queryRes = false;
  res: any;

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
    private _snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.setLanguageTools();
  }

  ngOnInit(): void {
    this.setWordCompleter(this.keyWordList, this.keyWordList2);
  }

  setLanguageTools(): void {
    ace.config.set('fontSize', '14px');
    ace.config.set('basePath', 'https://ace.c9.io/build/src-noconflict/');

    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.session.setValue('');
    this.aceEditor.completers = this.staticWordCompleter;
    this.aceEditor.setTheme('ace/theme/twilight');

    this.aceEditor.setOptions({
      highlightSelectedWord: true,
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    });
    this.aceEditor.on('change', () => {
      this.text = this.aceEditor.getValue();
    });
  }

  setWordCompleter(wordList: any, wordList2: any): void {
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

  openSnackBar(msg: string) {
    this._snackBar.open(msg, 'OK', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['snackbar'],
      duration: 5 * 1000,
    });
  }

  public queryExecuter() {
    this.loading = true;
    let queryObject = {
      WidgetId: this.id,
      Query: `$RESULT.SetCustomString(normal)\n$RESULT.SetRValue(4)\n$RESULT.GetStringVar:=RESULTSTRING\n$X.FilterSubtree($Item.GetValue.IsHavingSubstring(106)):=STAGELIST\n$STAGELIST.SeekToBegin\n$STAGELIST.GetCurrentElement:=STAGEELEM\nIf($STAGEELEM.CheckNotNull)\n$STAGEELEM.FilterSubtree($Item.GetValue.IsHavingSubstring(xportername)):=OUTERLIST\n$OUTERLIST.SeekToBegin\n$OUTERLIST.GetCurrentElement:=OUTERELEM\nIf($OUTERELEM.CheckNotNull)\n$OUTERELEM.FilterSubtree($Item.GetValue.IsStringEqualTo(name)):=LIST\n$LIST.SeekToBegin\n$LIST.GetCurrentElement:=ELEM\nIf($ELEM.CheckNotNull)\n$RESULTSTRING.AddPostFix($ELEM.GetLValue)\n$LIST.GetNextElement:=ELEM\nEndIf\nEndIf\nEndIf\n$RESULT.SetValue($RESULTSTRING)`,
    };

    console.log(queryObject);
    this.apiService.executeQueryAndUpdate(queryObject).subscribe({
      next: (result: any) => {
        if (result) {
          //get result
          console.log(result);
          this.onQuerySuccess.emit({
            query: queryObject.Query,
            result: result,
          });
          this.loading = false;
          this.res = result;
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        alert('An unexpected error occured. Please try again later');
      },
      complete: () => {
        this.queryRes = true;
      },
    });
  }
}
