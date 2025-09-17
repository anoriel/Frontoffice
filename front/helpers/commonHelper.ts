import _ from 'lodash';
import moment from "moment";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { SHA1, SHA256 } from 'crypto-js';


interface GenericListItem
{
  id: number | boolean;
  label: string;
}

interface DateRange
{
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerLocale
{
  direction: string;
  format: string;
  separator: string;
  applyLabel: string;
  cancelLabel: string;
  weekLabel: string;
  customRangeLabel: string;
  daysOfWeek: string[];
  monthNames: string[];
  firstDay: number;
}

interface DateRanges
{
  [key: string]: [Date, Date];
}

interface DiffResult
{
  type: string;
  data: any;
}

interface DiffMapper
{
  VALUE_CREATED: string;
  VALUE_UPDATED: string;
  VALUE_DELETED: string;
  VALUE_UNCHANGED: string;
  map(obj1: any, obj2: any): DiffResult | undefined | { [key: string]: any };
  compareValues(value1: any, value2: any): string;
  isFunction(x: any): boolean;
  isArray(x: any): boolean;
  isDate(x: any): boolean;
  isObject(x: any): boolean;
  isValue(x: any): boolean;
}

interface FormatBytesResult
{
  value: number;
  unit: string;
}

interface ObjectWithCountry
{
  iso3166?: string;
  pays?: {
    iso3166: string;
  };
  stringValue: string;
}

interface SlotObject
{
  id: number;
  stringValue?: string;
}

interface CommonHelperMethods
{
  capitalizeFirstLetter: (str: string | null | undefined) => string;
  listWithSlots: (list: GenericListItem[]) => GenericListItem[];
  isArray: (value: any) => value is any[];
  toString: (value: any) => string;
}

interface Vue3Instance extends CommonHelperMethods
{
  $t: (key: string) => string;
  $vueCryptojs: any;
  $createElement: any;
  $bvToast: any;
}

export default function useCommonHelper()
{
  function areObjectsEqual(obj1: object, obj2: object)
  {
    const obj1Entries = Object.entries(obj1).sort();
    const obj2Entries = Object.entries(obj2).sort();
    return JSON.stringify(obj1Entries) === JSON.stringify(obj2Entries);
  }


  function booleanListWithSlots(this: Vue3Instance): GenericListItem[]
  {
    return this.listWithSlots([
      {
        'id': false as any,
        'label': 'no'
      },
      {
        'id': true as any,
        'label': 'yes'
      },
    ]);
  }

  function capitalizeFirstLetter(str: string | null | undefined): string
  {
    if (!str) {
      return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function clearDate(range: DateRange): void
  {
    range.startDate = null;
    range.endDate = null;
  }

  function dateRangePickerLocale(this: Vue3Instance): DateRangePickerLocale
  {
    const locale: DateRangePickerLocale = {
      direction: 'ltr',
      format: 'yyyy-mm-dd',
      separator: ' ~ ',
      applyLabel: this.capitalizeFirstLetter(this.$t('apply')),
      cancelLabel: this.capitalizeFirstLetter(this.$t('cancel')),
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: [
        this.capitalizeFirstLetter(this.$t('weekday.sunday').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('weekday.monday').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('weekday.tuesday').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('weekday.wednesday').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('weekday.thursday').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('weekday.friday').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('weekday.saturday').slice(0, 3)),
      ],
      monthNames: [
        this.capitalizeFirstLetter(this.$t('month.january').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.february').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.march').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.april').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.may').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.june').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.july').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.august').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.september').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.october').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.november').slice(0, 3)),
        this.capitalizeFirstLetter(this.$t('month.december').slice(0, 3)),
      ],
      firstDay: parseInt(this.$t('dateRangePicker.firstDay'))
    };
    return locale;
  }

  function dateRangePickerLocaleRanges(this: Vue3Instance): DateRanges
  {
    const ranges: DateRanges = {};
    ranges[this.capitalizeFirstLetter(this.$t('dateRangePicker.today'))] = [moment().toDate(), moment().toDate()];
    ranges[this.capitalizeFirstLetter(this.$t('dateRangePicker.yesterday'))] = [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()];
    ranges[this.capitalizeFirstLetter(this.$t('dateRangePicker.thisMonth'))] = [moment().startOf('month').toDate(), moment().endOf('month').endOf('day').toDate()];
    ranges[this.capitalizeFirstLetter(this.$t('dateRangePicker.lastMonth'))] = [moment().subtract(1, 'months').startOf('month').toDate(), moment().subtract(1, 'months').endOf('month').endOf('day').toDate()];
    ranges[this.capitalizeFirstLetter(this.$t('dateRangePicker.thisQuarter'))] = [moment().startOf('quarter').toDate(), moment().endOf('quarter').endOf('day').toDate()];
    ranges[this.capitalizeFirstLetter(this.$t('dateRangePicker.lastQuarter'))] = [moment().subtract(1, 'quarters').startOf('quarter').toDate(), moment().subtract(1, 'quarters').endOf('quarter').endOf('day').toDate()];
    ranges[this.capitalizeFirstLetter(this.$t('dateRangePicker.thisYear'))] = [moment().startOf('year').toDate(), moment().endOf('year').endOf('day').toDate()];
    ranges[this.capitalizeFirstLetter(this.$t('dateRangePicker.lastYear'))] = [moment().subtract(1, 'years').startOf('year').toDate(), moment().subtract(1, 'years').endOf('year').endOf('day').toDate()];
    return ranges;
  }

  function deepCompareWithoutOrder(obj1: any, obj2: any): boolean
  {
    const sortKeys = (obj: any): string =>
    {
      try {
        return typeof obj != 'undefined' && obj != null ? JSON.stringify(obj, Object.keys(obj).sort()) : JSON.stringify(obj);
      } catch (error) {
        console.log(obj, error);
        return '';
      }
    };

    return _.isEqual(sortKeys(obj1), sortKeys(obj2));
  }

  function deepDiffMapper(): DiffMapper
  {
    return {
      VALUE_CREATED: 'created',
      VALUE_UPDATED: 'updated',
      VALUE_DELETED: 'deleted',
      VALUE_UNCHANGED: 'unchanged',
      map: function (obj1: any, obj2: any): DiffResult | undefined | { [key: string]: DiffResult | undefined }
      {
        if (this.isFunction(obj1) || this.isFunction(obj2)) {
          throw 'Invalid argument. Function given, object expected.';
        }
        if (this.isValue(obj1) || this.isValue(obj2)) {
          if (this.compareValues(obj1, obj2) == this.VALUE_UNCHANGED) {
            return;
          }
          return {
            type: this.compareValues(obj1, obj2),
            data: obj1 === undefined ? obj2 : obj1
          };
        }

        const diff: { [key: string]: DiffResult | undefined } = {};
        for (const key in obj1) {
          if (this.isFunction(obj1[key])) {
            continue;
          }

          let value2: any = undefined;
          if (obj2[key] !== undefined) {
            value2 = obj2[key];
          }

          diff[key] = this.map(obj1[key], value2) as any;
        }
        for (const key2 in obj2) {
          if (this.isFunction(obj2[key2]) || diff[key2] !== undefined) {
            continue;
          }

          diff[key2] = this.map(undefined, obj2[key2]) as any;
        }

        return diff;
      },
      compareValues: function (value1: any, value2: any): string
      {
        if (value1 === value2) {
          return this.VALUE_UNCHANGED;
        }
        if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
          return this.VALUE_UNCHANGED;
        }
        if (value1 === undefined) {
          return this.VALUE_CREATED;
        }
        if (value2 === undefined) {
          return this.VALUE_DELETED;
        }
        return this.VALUE_UPDATED;
      },
      isFunction: function (x: any): boolean
      {
        return Object.prototype.toString.call(x) === '[object Function]';
      },
      isArray: function (x: any): boolean
      {
        return Object.prototype.toString.call(x) === '[object Array]';
      },
      isDate: function (x: any): boolean
      {
        return Object.prototype.toString.call(x) === '[object Date]';
      },
      isObject: function (x: any): boolean
      {
        return Object.prototype.toString.call(x) === '[object Object]';
      },
      isValue: function (x: any): boolean
      {
        return !this.isObject(x) && !this.isArray(x);
      }
    };
  }

  function ExcelDateToJSDate(serial: number): Date
  {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    const total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    const total_seconds_remaining = total_seconds - seconds;
    const hours = Math.floor(total_seconds_remaining / (60 * 60));
    const minutes = Math.floor(total_seconds_remaining / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  }

  function formatBytesArray(this: Vue3Instance, bytes: number, inline: boolean = false): FormatBytesResult | string
  {
    const sizes = [
      "unit_bytes",
      "unit_kb",
      "unit_mb",
      "unit_gb",
      "unit_tb",
      "unit_pb",
      "unit_eb",
      "unit_zb",
      "unit_yb",
    ];
    let returnArray: FormatBytesResult;
    if (bytes == 0) {
      returnArray = {
        value: 0,
        unit: this.$t("unit_byte"),
      };
    } else {
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
      returnArray = {
        value: Math.round(bytes / Math.pow(1024, i)),
        unit: this.$t(sizes[i]),
      };
    }
    return inline ? returnArray.value + " " + returnArray.unit : returnArray;
  }

  function formatDate(value: string | Date | null | undefined): string | undefined
  {
    if (value) {
      return moment(new Date(String(value))).format("YYYY-MM-DD");
    }
  }

  function formatDateTime(value: string | Date | null | undefined): string | undefined
  {
    if (value) {
      return moment(new Date(String(value))).format("YYYY-MM-DD HH:mm:ss");
    }
  }

  function formatDateTimeZulu(value: string | Date | null | undefined): string | undefined
  {
    if (value) {
      return moment(new Date(String(value))).format("YYYY-MM-DDThh:mm:ssZ");
    }
  }

  function formatPeriod(value: string | Date | null | undefined): string | undefined
  {
    if (value) {
      return moment(new Date(String(value))).format("YYYY-MM");
    }
  }

  function getDifference(a: Record<string, any>, b: Record<string, any>): Record<string, any>
  {
    return Object.fromEntries(Object.entries(b).filter(([key, val]) => key in a && a[key] !== val));
  }

  function getGravatarURL(email: string, size: number = 24, imageStyle: string = 'wavatar')
  {
    const hashedEmail = SHA256(email);
    const gravatarUrl = `https://www.gravatar.com/avatar/${hashedEmail}?s=${size}&d=${imageStyle}`;
    return gravatarUrl;
  }

  function getHexColor(this: Vue3Instance, ciphertext: string | number, addColor: number = 0): string
  {
    if (ciphertext === 0) {
      return "000000";
    } else if (ciphertext === -1) {
      return "FFFFFF";
    }
    const code = SHA1(ciphertext.toString()).toString();
    return code.slice(5 + addColor, 6 + addColor) + code.slice(10 + addColor, 11 + addColor) + code.slice(15 + addColor, 16 + addColor) + code.slice(20 + addColor, 21 + addColor) + code.slice(25 + addColor, 26 + addColor) + code.slice(30 + addColor, 31 + addColor);
  }

  function getHourFromDate(value: string | Date | null | undefined): string | undefined
  {
    if (value) {
      return moment(new Date(String(value))).format("HH:ii:ss");
    }
  }

  function getObjectNameWithCountry(e: ObjectWithCountry): string | undefined
  {
    if (!('iso3166' in e) && (!('pays' in e) || typeof e.pays !== 'object' || !('iso3166' in e.pays))) return;
    return (e.iso3166 ?? e.pays?.iso3166) + e.stringValue;
  }

  function getSlotName(this: Vue3Instance, e: SlotObject): string
  {
    let returnValue = '< ' + this.$t('not assigned').toUpperCase() + ' >';

    if (e.id == 0) {
      returnValue = '< ' + this.$t('anything').toUpperCase() + ' >';
    } else if (e && e.stringValue) {
      returnValue = e.stringValue;
    }
    return returnValue;
  }

  function initiale(str: string): string
  {
    return str.charAt(0).toUpperCase();
  }

  function isArray(value: any): value is any[]
  {
    return Array.isArray(value);
  }

  function isObject(x: any): boolean
  {
    return Object.prototype.toString.call(x) === '[object Object]' || (typeof x === 'object' && x !== null);
  }

  function isEmptyOrNull(value: any): boolean
  {
    return value === null || value === undefined || value === '';
  }

  function listWithSlots(list: GenericListItem[]): GenericListItem[]
  {
    list.unshift({
      'id': -1,
      'label': 'not assigned'
    });
    list.unshift({
      'id': 0,
      'label': 'anything'
    });

    return list;
  }

  function lowercaseFirstLetter(str: string): string
  {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  function numberToString(i: number): string
  {
    const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"]
    return numbers[i] ?? "none"
  }

  function makeToast(this: Vue3Instance, title: string, msg: string, variant: string | null = null, delay: number = 0): void
  {
    const today = new Date();

    const vNodesTitle = this.$createElement(
      "div",
      { class: ["d-flex", "flex-grow-1", "align-items-baseline", "mr-2"] },
      [
        this.$createElement("strong", { class: "mr-2" }, title),
        this.$createElement(
          "small",
          { class: "ml-auto text-italics" },
          today.toLocaleString("fr-FR")
        ),
      ]
    );

    this.$bvToast.toast(msg, {
      title: [vNodesTitle],
      variant: variant,
      solid: true,
      appendToast: true,
      autoHideDelay: delay,
      noAutoHide: delay == 0,
    });
  }

  function padZero(str: string | number, len?: number): string
  {
    len = len || 2;
    const zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  function removeDuplicates(arr: any[]): any[]
  {
    const seen: Record<string, boolean> = {};
    return arr.filter(item =>
    {
      const key = JSON.stringify(item);
      return seen[key] ? false : (seen[key] = true);
    });
  }

  function removeItemFromList(item: { id: any }, list: any[]): void
  {
    const found = list.find(e => e.id == item.id);
    if (found) {
      list.splice(list.indexOf(found), 1);
    }
  }

  function saveToExcel(moduleName: string, exportList: Record<string, any>[]): void
  {
    const filename = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '_') + "_" + moduleName + "_export.xlsx";

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'In3net';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet(moduleName);

    const columns: ExcelJS.TableColumnProperties[] = [];
    Object.keys(exportList[0]).forEach(key =>
    {
      columns.push({ name: key, filterButton: true });
    });

    const rows: any[][] = [];
    exportList.forEach(element =>
    {
      rows.push(Object.values(element));
    });

    worksheet.addTable({
      name: moduleName,
      ref: 'A1',
      headerRow: true,
      totalsRow: false,
      style: {
        theme: 'TableStyleMedium7',
        showRowStripes: true,
      },
      columns: columns,
      rows: rows
    });

    const PIXELS_PER_EXCEL_WIDTH_UNIT = 7.5;
    const MIN_PIXELS_WIDTH = 55;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const maxColumnLengths: number[] = [];
    worksheet.eachRow((row: any, rowNum: number) =>
    {
      if (rowNum < 0) {
        return;
      }

      row.eachCell((cell: any, num: number) =>
      {
        if (typeof cell.value === 'string') {
          if (maxColumnLengths[num] === undefined) {
            maxColumnLengths[num] = 0;
          }

          const fontSize = cell.font && cell.font.size ? cell.font.size : 11;
          ctx.font = `${fontSize}pt Arial`;
          const metrics = ctx.measureText(cell.value);
          const cellWidth = metrics.width;

          maxColumnLengths[num] = Math.max(maxColumnLengths[num], cellWidth, MIN_PIXELS_WIDTH);
        }
      });
    });

    for (let i = 1; i <= worksheet.columnCount; i++) {
      const col = worksheet.getColumn(i);
      const width = maxColumnLengths[i];
      if (width) {
        col.width = width / PIXELS_PER_EXCEL_WIDTH_UNIT + 1;
      }
    }

    workbook.xlsx.writeBuffer().then(function (buffer: any)
    {
      const blob = new Blob([buffer], { type: "application/xlsx" });
      saveAs(blob, filename);
    });
  }

  function sleep(ms: number): void
  {
    const start = new Date().getTime();
    let stop = 1000000;
    let diff = 0;
    while (diff < ms || stop-- <= 0) {
      diff = new Date().getTime() - start;
      console.log(diff, ms);
    }
  }

  function sprintf(str: string, ...argv: any[]): string
  {
    return !argv.length
      ? str
      : sprintf(str.replace("%s", argv.shift()), ...argv);
  }

  function toString(value: any): string
  {
    if (value === null || typeof value === 'undefined') {
      return '';
    } else if (value instanceof Object) {
      if ('stringValue' in value) {
        return value.stringValue;
      }
      return Object.keys(value)
        .sort()
        .map(key => toString(value[key]))
        .join(' ');
    } else {
      return String(value);
    }
  }

  return {
    areObjectsEqual,
    booleanListWithSlots,
    capitalizeFirstLetter,
    clearDate,
    dateRangePickerLocale,
    dateRangePickerLocaleRanges,
    deepCompareWithoutOrder,
    deepDiffMapper,
    ExcelDateToJSDate,
    formatBytesArray,
    formatDate,
    formatDateTime,
    formatDateTimeZulu,
    formatPeriod,
    getDifference,
    getGravatarURL,
    getHexColor,
    getHourFromDate,
    getObjectNameWithCountry,
    getSlotName,
    initiale,
    isArray,
    isObject,
    isEmptyOrNull,
    listWithSlots,
    lowercaseFirstLetter,
    numberToString,
    makeToast,
    padZero,
    removeDuplicates,
    removeItemFromList,
    saveToExcel,
    sleep,
    sprintf,
    toString,
  }
}
