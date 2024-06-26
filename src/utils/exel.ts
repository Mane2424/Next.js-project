import { Alignment, Border, Borders, Fill, Worksheet } from "exceljs";
import moment from "moment";

// const currency = "USD";
const currencySymbol = "$";
const currencyFormat = `"${currencySymbol}"#,##0.00;[Red]("${currencySymbol}"#,##0.00)`;
const thinBorder: Partial<Border> = { style: "thin", color: { argb: "#000" } };
export const addTableHeader = (worksheet: Worksheet, title: string) => {
	const headerRow = worksheet.getRow(2);
	headerRow.height = 30;
	worksheet.mergeCells(2, 2, 2, 8);
	headerRow.getCell(2).value = title;
	headerRow.getCell(2).font = { size: 18, bold: true };
	headerRow.getCell(2).alignment = { horizontal: "center" };
};

export const addAmountsWidget = (
	worksheet: Worksheet,
	color: string,
	startColumnIndex: number,
	title: string,
	columns: { name: string; value: number }[]
) => {
	const widgetHeaderRow = worksheet.getRow(4);
	if (columns.length > 1) {
		worksheet.mergeCells(
			4,
			startColumnIndex,
			4,
			startColumnIndex + columns.length - 1
		);
	}
	const titleCell = widgetHeaderRow.getCell(startColumnIndex);
	const centerAlignment: Partial<Alignment> = { horizontal: "center" };
	const fill: Fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: color },
	};
	titleCell.value = title;
	titleCell.alignment = centerAlignment;
	titleCell.fill = fill;
	titleCell.font = {
		size: 11,
		bold: true,
	};
	titleCell.border = {
		top: thinBorder,
		left: thinBorder,
		right: thinBorder,
	};

	const widgetColumnsHeaderRow = worksheet.getRow(5);
	const widgetColumnsValuesRow = worksheet.getRow(6);
	columns.forEach((column, index: number) => {
		const headerCell = widgetColumnsHeaderRow.getCell(startColumnIndex + index);
		headerCell.value = column.name;
		headerCell.alignment = centerAlignment;
		headerCell.fill = fill;
		headerCell.font = {
			size: 12,
			underline: true,
		};

		const valueCell = widgetColumnsValuesRow.getCell(startColumnIndex + index);
		valueCell.value = column.value;
		valueCell.alignment = centerAlignment;
		valueCell.fill = fill;
		valueCell.font = {
			size: 14,
			bold: true,
		};
		valueCell.numFmt = currencyFormat;
		let valueCellBorder: Partial<Borders> = { bottom: thinBorder };
		if (index === 0) {
			let headerCellBorder: Partial<Borders> = {
				left: thinBorder,
			};
			if (columns.length === 1) {
				headerCellBorder = {
					...headerCellBorder,
					right: thinBorder,
				};
				valueCellBorder = {
					...valueCellBorder,
					right: thinBorder,
				};
			}
			headerCell.border = headerCellBorder;
			valueCell.border = {
				...valueCellBorder,
				left: thinBorder,
			};
		} else if (index === columns.length - 1) {
			headerCell.border = { right: thinBorder };
			valueCell.border = {
				...valueCellBorder,
				right: thinBorder,
			};
		}
	});
};

export const getFileName = (prefix: string) => {
	return `${prefix}_${moment().format("YYYY-MM-DD_hhmmss_a")}.xlsx`;
};

export const addTableBorders = (
	worksheet: Worksheet,
	cellRange: any,
	headerRowsAmount?: number
) => {
	for (
		let rowIndex = cellRange.from.row;
		rowIndex <= cellRange.to.row;
		rowIndex++
	) {
		for (
			let columnIndex = cellRange.from.column;
			columnIndex <= cellRange.to.column;
			columnIndex++
		) {
			const border: Partial<Borders> = {};
			if (columnIndex === cellRange.from.column) {
				border.left = thinBorder;
			}

			if (
				rowIndex === cellRange.from.row ||
				(headerRowsAmount && rowIndex <= cellRange.from.row + headerRowsAmount)
			) {
				/** Borders for header row */
				border.top = border.bottom = thinBorder;
			} else {
				/** Border for data row */
				border.bottom = {
					style: rowIndex === cellRange.to.row ? "thin" : "dotted",
					color: { argb: "#000" },
				};
			}

			if (columnIndex === cellRange.to.column) {
				border.right = thinBorder;
			}
			worksheet.getCell(rowIndex, columnIndex).border = border;
		}
	}
};
export const addMergedColumnLeftBorder = (
	worksheet: Worksheet,
	cellRange: any
) => {
	/** Add left border to the first merged column */
	const topMergedColumn = worksheet.getCell(
		cellRange.from.row,
		cellRange.from.column + 2
	);
	topMergedColumn.border = {
		...topMergedColumn.border,
		left: thinBorder,
	};
};
