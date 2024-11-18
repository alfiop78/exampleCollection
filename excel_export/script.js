// import zipcelx from 'zipcelx';

const config = {
    filename: 'excel_with_plugin',
    sheet: {
        data: [
            [{
                value: 'test 1 colonna',
                type: 'string'
            }, {
                value: 1400,
                type: 'number'
            }]
        ]
    }
};

zipcelx(config);


var export__datatable_xls = document.getElementById('export__datatable_xls');
function replacement(match, offset, string) {
    return `&#${match.charCodeAt()};`;
}
function export_datatable_XLS() {
    // INFO: i valori NULL causano un errore in fase di apertura su office 365
    // WARN: In locale dovrebbe comparire un errore https
    const mso = "progid='Excel.Sheet'";
    let xml = `<?xml version='1.0' encoding='UTF-8'?><?mso-application ${mso}?>`;
    let xlsWorkbook = "<Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet' xmlns:html='https://www.w3.org/TR/html401/'>";
    // let xlsStyles = ["<ss:Styles>"];
    // xlsStyles.push("<ss:Style ss:ID='xl1'><ss:Font ss:Size='11' ss:Bold='1' ss:Color='black'/><ss:Alignment ss:Horizontal='Center' ss:Vertical='Center'/></ss:Style>");
    // currency con 2 cifre decimali
    // xlsStyles.push("<ss:Style ss:ID='currency'><ss:Font ss:Size='10' ss:Color='black'/><ss:NumberFormat ss:Format='Euro Currency'/></ss:Style>");
    // standard : 2 dec
    // xlsStyles.push("<ss:Style ss:ID='standard'><ss:Font ss:Size='10' ss:Color='black'/><ss:NumberFormat ss:Format='Standard'/></ss:Style>");
    // senza cifre decimali
    // xlsStyles.push("<ss:Style ss:ID='number'><ss:Font ss:Size='10' ss:Color='black'/><ss:NumberFormat ss:Format='General'/></ss:Style>");
    // xlsStyles.push("<ss:Style ss:ID='percent'><ss:Font ss:Size='10' ss:Color='black'/><ss:NumberFormat ss:Format='Percent'/></ss:Style>");
    // xlsStyles.push("<ss:Style ss:ID='xlFilterValue'><ss:Font ss:Bold='1' ss:Color='black'/><ss:Alignment ss:Horizontal='Center' ss:Vertical='Center'/><ss:Interior ss:Color='#9CB4CC' ss:Pattern='Solid'/></ss:Style>");
    // xlsStyles.push("</ss:Styles>");
    let xlsWorksheet = "<Worksheet ss:Name='Foglio 1'>";
    let xlsTable = "<Table>";
    let xlsColumns = [],
        xlsHeader = [],
        xlsRows = [];

    // Header
    xlsHeader.push("<Row ss:Height='25'>");
    xlsHeader.push("<Cell><Data ss:Type='String'>COLONNA 1</Data></Cell>");
    // WARN: l'index deve iniziare da 1 e non da 0
    xlsColumns.push("<Column ss:Index='1' ss:AutoFitWidth='1'/>");
    xlsHeader.push("</Row>");
    xlsRows.push("<Row ss:Height='20'>");
    const val = 'val&ore 1';
    const value = val.replace(/(?=\S)[^.\w]/g, replacement);
    // const value = col.v.replace(/(?=\S)[^.\w]/g, replacement);
    xlsRows.push(`<Cell><Data ss:Type='String'>${value}</Data></Cell>`);

    xlsRows.push("</Row>");
    // console.log(xlsRows);

    let endTable = "</Table>";
    let endWorksheet = "</Worksheet>";
    let endWorkbook = "</Workbook>";
    // return xml + xlsWorkbook + xlsStyles.join('') + xlsWorksheet + xlsTable + xlsColumns.join('') + xlsHeader.join('') + xlsRows.join('') + endTable + endWorksheet + endWorkbook;
    // return xml + xlsWorkbook + xlsWorksheet + xlsTable + xlsColumns.join('') + xlsHeader.join('') + xlsRows.join('') + endTable + endWorksheet + endWorkbook;
    const _xml = xml + xlsWorkbook + xlsWorksheet + xlsTable + xlsColumns.join('') + xlsHeader.join('') + xlsRows.join('') + endTable + endWorksheet + endWorkbook;
    export__datatable_xls.href = 'data:application/vnd.ms-excel,' + encodeURIComponent(_xml);
    export__datatable_xls.download = `excel_datatable.xls`;
}

// export_datatable_XLS();
// xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40"
function test() {
    const _xml = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:c="urn:schemas-microsoft-com:office:component:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x2="http://schemas.microsoft.com/office/excel/2003/xml" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"><WindowHeight>9000</WindowHeight><WindowWidth>13860</WindowWidth><WindowTopX>240</WindowTopX><WindowTopY>75</WindowTopY><ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook><Styles><Style ss:ID="Default" ss:Name="Default"/><Style ss:ID="Note" ss:Name="Note"><Font ss:FontName="Liberation Sans" ss:Size="10"/></Style><Style ss:ID="Default" ss:Name="Default"/><Style ss:ID="Heading" ss:Name="Heading"><Alignment/><Font ss:Bold="1" ss:Size="24"/></Style><Style ss:ID="Heading_20_1" ss:Name="Heading 1"><Alignment/><Font ss:Bold="1" ss:Size="18"/></Style><Style ss:ID="Heading_20_2" ss:Name="Heading 2"><Alignment/><Font ss:Bold="1" ss:Size="12"/></Style><Style ss:ID="Text" ss:Name="Text"><Alignment/></Style><Style ss:ID="Note" ss:Name="Note"><Alignment/><Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#808080"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#808080"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#808080"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="3" ss:Color="#808080"/></Borders><Interior ss:Color="#ffffcc" ss:Pattern="Solid"/></Style><Style ss:ID="Footnote" ss:Name="Footnote"><Alignment/></Style><Style ss:ID="Hyperlink" ss:Name="Hyperlink"><Alignment/></Style><Style ss:ID="Status" ss:Name="Status"><Alignment/></Style><Style ss:ID="Good" ss:Name="Good"><Alignment/><Interior ss:Color="#ccffcc" ss:Pattern="Solid"/></Style><Style ss:ID="Neutral" ss:Name="Neutral"><Alignment/><Interior ss:Color="#ffffcc" ss:Pattern="Solid"/></Style><Style ss:ID="Bad" ss:Name="Bad"><Alignment/><Interior ss:Color="#ffcccc" ss:Pattern="Solid"/></Style><Style ss:ID="Warning" ss:Name="Warning"><Alignment/></Style><Style ss:ID="Error" ss:Name="Error"><Alignment/><Interior ss:Color="#cc0000" ss:Pattern="Solid"/></Style><Style ss:ID="Accent" ss:Name="Accent"><Alignment/></Style><Style ss:ID="Accent_20_1" ss:Name="Accent 1"><Alignment/><Font ss:Bold="1" ss:Color="#ffffff"/><Interior ss:Color="#000000" ss:Pattern="Solid"/></Style><Style ss:ID="Accent_20_2" ss:Name="Accent 2"><Alignment/><Font ss:Bold="1" ss:Color="#ffffff"/><Interior ss:Color="#808080" ss:Pattern="Solid"/></Style><Style ss:ID="Accent_20_3" ss:Name="Accent 3"><Alignment/><Interior ss:Color="#dddddd" ss:Pattern="Solid"/></Style><Style ss:ID="Result" ss:Name="Result"><Alignment/><Font ss:Bold="1" ss:Italic="1" ss:Underline="Single"/></Style><Style ss:ID="co1"/><Style ss:ID="ta1"/></Styles><ss:Worksheet ss:Name="Foglio1"><Table ss:StyleID="ta1"><Column ss:Width="64,0063"/><Row ss:Height="12,8126"><Cell><Data ss:Type="String">foglio</Data></Cell></Row><Row ss:Height="12,8126"><Cell><Data ss:Type="String">creato da libreoffice e salvato in xlsx</Data></Cell></Row></Table><x:WorksheetOptions/></ss:Worksheet></Workbook>';
    const __xml = '<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>' +
        '<Workbook xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
        '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">' +
        '<Author>Service</Author><LastAuthor>Service</LastAuthor><Created>2024-11-15T09:23:49Z</Created><LastSaved>2024-11-15T09:24:48Z</LastSaved><Version>16.00</Version>' +
        '</DocumentProperties>' +
        '<OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office"><AllowPNG/></OfficeDocumentSettings>' +
        '<ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"><WindowHeight>7890</WindowHeight><WindowWidth>21570</WindowWidth><WindowTopX>32767</WindowTopX><WindowTopY>32767</WindowTopY><ProtectStructure>False</ProtectStructure><ProtectWindows>False</ProtectWindows></ExcelWorkbook>' +
        '<Styles><Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Bottom"/><Borders/><Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/><Interior/><NumberFormat/><Protection/></Style></Styles>' +
        '<Worksheet ss:Name="Foglio1"><Table ss:ExpandedColumnCount="1" ss:ExpandedRowCount="1" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="15"><Row><Cell><Data ss:Type="String">ciao</Data></Cell></Row></Table>' +
        '<WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><PageSetup>' +
        '<Header x:Margin="0.3"/><Footer x:Margin="0.3"/><PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/></PageSetup><Selected/><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios></WorksheetOptions></Worksheet>' +
        '</Workbook>';


    // export__datatable_xls.href = 'data:application/vnd.ms-excel,' + encodeURIComponent(__xml);
    // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet // corrisponde a .xlsx
    // export__datatable_xls.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + window.btoa(unescape(encodeURIComponent(__xml)));
    export__datatable_xls.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' + encodeURIComponent(__xml);
    // export__datatable_xls.href = 'data:application/vnd.ms-excel;base64,' + window.btoa(unescape(encodeURIComponent(__xml)));
    // export__datatable_xls.download = 'excel_datatable_58.xlsx';
    export__datatable_xls.download = 'excel_datatable_60.xlsx';
}

// test();
// lettura xml su pc, funziona (in microsoft excel) con .xls
/* function test_2() {
    fetch("da_provare.xml")
        .then((response) => response.text())
        .then((text) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/xml");
            // console.log(doc);
            // console.log(doc.documentElement.nodeName);
            // debugger;
            export__datatable_xls.href = 'data:application/vnd.ms-excel,' + encodeURIComponent(text);
            export__datatable_xls.download = 'excel_datatable_18_1.xls';

            // export__datatable_xls.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' + encodeURIComponent(text);
            // export__datatable_xls.download = 'excel_datatable_18_1.xlsx';
        });
    // console.log(wb);
}

test_2(); */

function test_3() {
    fetch("test_excel_struct/[Content_Types].xml")
        .then((response) => response.text())
        .then((text) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/xml");
            const worksheet = '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><sheetPr><outlinePr summaryBelow="0" summaryRight="0"/></sheetPr><sheetViews><sheetView workbookViewId="0"/></sheetViews><sheetFormatPr customHeight="1" defaultColWidth="12.63" defaultRowHeight="15.75"/><sheetData><row r="1"><c r="A1" s="1" t="s"><v>0</v></c></row></sheetData><drawing r:id="rId1"/></worksheet>';
            const sharedString = '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="1" uniqueCount="1"><si><t>test</t></si></sst>';
            const drawing = '<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram" xmlns:x3Unk="http://schemas.microsoft.com/office/drawing/2010/slicer" xmlns:sle15="http://schemas.microsoft.com/office/drawing/2012/slicer"/>';
            const styles = '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><fonts count="2"><font><sz val="10.0"/><color rgb="FF000000"/><name val="Arial"/><scheme val="minor"/></font><font><color theme="1"/><name val="Arial"/><scheme val="minor"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="lightGray"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf borderId="0" fillId="0" fontId="0" numFmtId="0" applyAlignment="1" applyFont="1"/></cellStyleXfs><cellXfs count="2"><xf borderId="0" fillId="0" fontId="0" numFmtId="0" xfId="0" applyAlignment="1" applyFont="1"><alignment readingOrder="0" shrinkToFit="0" vertical="bottom" wrapText="0"/></xf><xf borderId="0" fillId="0" fontId="1" numFmtId="0" xfId="0" applyAlignment="1" applyFont="1"><alignment readingOrder="0"/></xf></cellXfs><cellStyles count="1"><cellStyle xfId="0" name="Normal" builtinId="0"/></cellStyles><dxfs count="0"/></styleSheet>';
            const theme = '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" name="Sheets"><a:themeElements><a:clrScheme name="Sheets"><a:dk1><a:srgbClr val="000000"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="000000"/></a:dk2><a:lt2><a:srgbClr val="FFFFFF"/></a:lt2><a:accent1><a:srgbClr val="4285F4"/></a:accent1><a:accent2><a:srgbClr val="EA4335"/></a:accent2><a:accent3><a:srgbClr val="FBBC04"/></a:accent3><a:accent4><a:srgbClr val="34A853"/></a:accent4><a:accent5><a:srgbClr val="FF6D01"/></a:accent5><a:accent6><a:srgbClr val="46BDC6"/></a:accent6><a:hlink><a:srgbClr val="1155CC"/></a:hlink><a:folHlink><a:srgbClr val="1155CC"/></a:folHlink></a:clrScheme><a:fontScheme name="Sheets"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface="Arial"/><a:cs typeface="Arial"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface="Arial"/><a:cs typeface="Arial"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>';
            const workbook = '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><workbookPr/><sheets><sheet state="visible" name="Foglio1" sheetId="1" r:id="rId4"/></sheets><definedNames/><calcPr/></workbook>';
            let text_ = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><?mso-application progid="Excel.Sheet"?>' + worksheet + sharedString + drawing + styles + theme + workbook;
            console.log(text_);

            export__datatable_xls.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,' + encodeURIComponent(text_);
            // export__datatable_xls.download = 'excel_datatable_18_1.xls';
            export__datatable_xls.download = 'excel_datatable_18_1.xlsx';
        });
    // console.log(wb);
}


test_3();
