export function asgBytesFilter() {
	return (bytes : any, precision : number) : string => {

		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) {
			return '';
		}

		if (bytes === 0) {
			return '0';
		}

		if (typeof precision === 'undefined') {
			precision = 1;
		}

		let units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));

		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
	};
}
