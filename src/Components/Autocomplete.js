import React from 'react';


const Autocomplete = ({text, setText, cards, suggestions, setSuggestions, setPokeCards, setTrainerCards, setEnergyCards, setTabIndex, selectSet, currentSetCode}) => {
const onTextChanged = e => {
    let cardNames = cards.map(c => c.name)
    const value = e.target.value;
    if (value.length > 0) {
        const regex = new RegExp(`${value}`, `i`);
        setSuggestions(cardNames.sort().filter(v => regex.test(v)))
        setText(value);
    }
    else{
        setSuggestions([]);
        setText(value);
        selectSet(currentSetCode);
    }
}
const onItemSelect = card => {
    if(card.supertype === 'Pokémon'){
        setPokeCards([card]);
        setTabIndex(1);
    }
    else if(card.supertype === 'Trainer'){
        setTrainerCards([card]);
        setTabIndex(2);
    }
    else if(card.supertype === 'Energy'){
        setEnergyCards([card]);
        setTabIndex(3);
    }
}
return (

        <div className='autocomplete'>
 {!cards ? <input autocomplete='off'  type='text' name='search'  disabled placeholder='Select a set to search...'/> : <input autocomplete='off' value={text} onChange={onTextChanged} type='text' name='search'  placeholder='Search...' />}

            <ul>
                {suggestions.length === 0 ? null : suggestions.map(i => <li onClick={() => { setText(i); setSuggestions([]); onItemSelect(cards.find(c => c.name === i))}}>{i}</li>)}
            </ul>
        </div>
)

}

export default Autocomplete;
