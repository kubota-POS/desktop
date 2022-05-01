import React, { useEffect, useState } from 'react'
import { FormControl, InputGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { zawgyi, t } from '../../utilities/translation.utility';

export const CategorySearchComponent = ({ dataSource , retrive }) => {

    const state = useSelector(state => state)
    const { lang } = state;

    const [text, setText] = useState('');
    const [categories, setCategories] = useState([]);

    const suggestionSearch = (value) => {
        setText(value);

        if(value === '') {
            retrive(dataSource)
            return;
        }

        const suggestionResultForName = categories.filter((category) => category.name !== null && category.name.toLowerCase().includes(text.toLowerCase()));
        const suggestionResultForDescription = categories.filter((category) => category.description !== null && category.description.toLowerCase().includes(text.toLowerCase()));

        const suggestionResult = suggestionResultForName.concat(suggestionResultForDescription);

        retrive(suggestionResult);
        return;
    }

    useEffect(() => {
        if(dataSource) {
            setCategories(dataSource)
        }
    },[dataSource])
    

    return (
        <>
            <InputGroup>
                <FormControl
                    className={`${zawgyi(lang)}`}
                    type="text"
                    placeholder={t('search')} 
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyPress={e => {
                        if(e.code === 'Enter') {
                            suggestionSearch(e.target.value)
                        }
                    }}
                    />
            </InputGroup>
        </>
    )
}