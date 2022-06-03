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
import { Store } from '@ngrx/store';
import {
  addQueryResult,
  deleteQueryResult,
  updateBarChart,
  updateBubbleChart,
  updatePieChart,
  updateTable,
} from 'src/app/store/nft-state-store/nft.actions';
import { PopupMessageService } from 'src/app/services/popup-message/popup-message.service';
import {
  selectNFT,
  selectNFTContent,
  selectQueryResult,
} from 'src/app/store/nft-state-store/nft.selector';
import { AppState } from 'src/app/store/app.state';
import {
  barchart,
  bubblechart,
  piechart,
  table,
} from 'src/models/nft-content/widgetTypes';

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
  @Input() widget: any;
  @Output() onQueryResult: EventEmitter<any> = new EventEmitter();
  text: string = '';
  staticWordCompleter: any;
  aceEditor: ace.Ace.Editor;
  loading: boolean = false;
  queryRes = false;
  res: any;
  showOutput: boolean = false;
  jsonString = '';
  jsonPretty: any = '// No Output';
  newResults: boolean = false;
  tempQueryResults: string = '';
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
    private popupMsgService: PopupMessageService,
    private store: Store<AppState>
  ) {}

  ngAfterViewInit(): void {
    this.setLanguageTools();
  }

  ngOnInit(): void {
    this.setWordCompleter(this.keyWordList, this.keyWordList2);
  }

  /**
   * @function setLanguageTools - set language tools on the editor
   */
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

  /**
   * @function setWordCompleter
   * @param wordList
   */
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

  /**
   * @function saveExecuter - save the query
   */
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

      this.popupMsgService.openSnackBar('Query saved successfully!');
    } else {
      this.popupMsgService.openSnackBar('Invalid query result format!');
    }
  }

  /**
   * @function queryExecuter - executes the query
   */
  public queryExecuter() {
    this.loading = true;
    let queryObject = {
      WidgetId: this.id,
      Query: JSON.stringify(this.query)
        .replace(/\\r\\n|\\n\\r|\\n/g, '\n')
        .replace(/"/g, ''),
    };

    this.apiService.executeQueryAndUpdate(queryObject).subscribe({
      next: (result: any) => {
        if (result) {
          //get result

          this.loading = false;
          if (result.Response !== 'invalid Query') {
            this.res = result;
            this.checkOutput();
          } else {
            this.onQueryResult.emit({
              query: this.query,
              success: false,
            });
            this.popupMsgService.openSnackBar(
              'An unexpected error occured. Please try again later'
            );
          }
        }
      },
      error: (err) => {
        this.loading = false;
        this.onQueryResult.emit({
          query: this.query,
          success: false,
        });
        this.popupMsgService.openSnackBar(
          'An unexpected error occured. Please try again later'
        );
      },
      complete: () => {
        this.queryRes = true;
      },
    });
  }

  /**
   * @function checkOutput - executes the query
   */
  private checkOutput() {
    //{"type": 4, "val": {"ChartData":[{"Name":"averageAnnualTemperature","Value":"24"}]}} - charts
    //{"type": 4, "val": {"MainTable":[{"Farm Name":"Medathennawaththa","Temperature":"24","Humidity":"80%","Rainfall":"1800 mm"}]}} - table

    let output = this.res.Response.result;
    let outputObject = JSON.stringify(output);
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
        this.onQueryResult.emit({
          data: result.val['ChartData'],
          query: this.query,
          success: true,
        });
        this.saveExecuter();
      } else {
        this.onQueryResult.emit({
          query: this.query,
          success: false,
        });
        this.popupMsgService.openSnackBar(
          'Invalid query output. Please check the query.'
        );
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
        this.onQueryResult.emit({
          data: result.val['ChartData'],
          query: this.query,
          success: true,
        });
        this.saveExecuter();
      } else {
        this.onQueryResult.emit({
          query: this.query,
          success: false,
        });
        this.popupMsgService.openSnackBar(
          'Invalid query output. Please check the query.'
        );
      }
    } else if (this.type === 'table') {
      if (
        result['val'] !== undefined &&
        result.val['MainTable'] !== undefined &&
        result.val.MainTable.length > 0
      ) {
        this.onQueryResult.emit({
          data: result.val.MainTable,
          query: this.query,
          success: true,
        });
        this.saveExecuter();
      } else {
        this.onQueryResult.emit({
          query: this.query,
          success: false,
        });
        this.popupMsgService.openSnackBar(
          'Invalid query output. Please check the query.'
        );
      }
    } else {
      this.onQueryResult.emit({
        query: this.query,
        success: false,
      });
      this.popupMsgService.openSnackBar(
        'Invalid query output. Please check the query.'
      );
    }

    this.outputJson(data);
    this.newResults = true;
  }

  /**
   * @function outputJson - stringify the json
   * @param data
   */
  public outputJson(data: any) {
    this.jsonPretty = JSON.stringify(JSON.parse(data), null, 2);
  }

  /**
   * @function toggleOutput
   */
  public toggleOutput() {
    this.showOutput = !this.showOutput;
    this.newResults = false;
  }
}
