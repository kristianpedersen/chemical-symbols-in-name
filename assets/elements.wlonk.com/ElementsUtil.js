// JavaScript

function getElemNumStr(elemNum)
{
	// Given 1, return 'e001'
	return 'e' + ('000' + elemNum).slice(-3);
}

function popupPlainPeriodicTable(image) {
	// Popup plain periodic table
	var win=window.open('PerTbl_w608.gif','image','left=20,top=20,width=640,height=350,resizable=yes,scrollbars=yes,menubar=no,toolbar=no');
	if (win) win.focus();
}