
export const autocomplete = (dataSource, text, columnName) => {
    const textString = text;

    const filterResult = dataSource.filter((result, index) => {

        let filterText = result[columnName] ? result[columnName] : '';

        if(Number(result[columnName])) {
            filterText = result[columnName].toString();

            if(filterText.includes(textString)) {
                return result;
            }
        }

        if(filterText.toLowerCase().includes(textString.toLowerCase())) {
            return result;
        }

    });

    return filterResult;
    

}