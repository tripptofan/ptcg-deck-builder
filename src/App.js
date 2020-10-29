/*Node Packages*/
import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Axios from 'axios';

/*Components*/
import Autocomplete from './Components/Autocomplete';

/*Stylesheets*/
import './App.css';
import './Tabs.css';
import './Styles/sets.css';
import './Styles/cards.css';
import './Styles/deck.css'
import './Styles/deckManager.css';
import './Styles/modal.css';
import './Styles/autocomplete.css';

/*Images*/
import cardsPic from  './Images/cards.png';
import ptcgLogo from './Images/ptcglogo.gif'
import upArrow from './Images/uparrow.png';
import downArrow from './Images/downarrow.png';
import cardIcon from './Images/cardicon.png';
import magGlass from './Images/magglass.png';
import trash from './Images/trash.png';

function App() {


  const [deckNameInput, setDeckNameInput] = useState();
  const [sets, setSets] = useState();
  const [deck, setDeck] = useState({cards: [],deckInfo: {deckName: null,'Pokémon':0, 'Trainer': 0,'Energy': 0, totalCards: 0}});
  const [savedDecks, setSavedDecks] = useState(JSON.parse(localStorage.getItem('savedDecks')) || []);
  const [cards, setCards] = useState();
  const [pokeCards, setPokeCards] = useState();
  const [trainerCards, setTrainerCards] = useState();
  const [energyCards, setEnergyCards] = useState();
  const [deckCounter, setDeckCounter] = useState(0);
  const [currentSetCode, setCurrentSetCode] = useState();
  const [card, setCard] = useState();
  const [deckSelected, setDeckSelected]= useState();

  const [tabIndex, setTabIndex] = useState(0);

  const [text, setText] = useState();
  const [suggestions, setSuggestions] = useState([]);

  const [mobileInfo, setMobileInfo] = useState(false);
  const [mobileDeck, setMobileDeck] = useState(false);

  const selectSet = (code) => {
    Axios.get(`https://api.pokemontcg.io/v1/cards?setCode=${code}`)
      .then(res => {
        setPokeCards(res.data.cards.filter(card => card.supertype === 'Pokémon'))
        setTrainerCards(res.data.cards.filter(card => card.supertype === 'Trainer'))
        setEnergyCards(res.data.cards.filter(card => card.supertype === 'Energy'))
        setCards(res.data.cards);

      })
     if(!currentSetCode){
      document.getElementById(code).style.backgroundColor ='#DBAFD5';
      setCurrentSetCode(code);
     }else if(code === currentSetCode){
  return
     }else{
      document.getElementById(code).style.backgroundColor ='#DBAFD5';
      document.getElementById(currentSetCode).style.backgroundColor ='white';
      setCurrentSetCode(code);
     }
     
  }

const nextCard = (card,type) => {
  if(type === 'Pokémon'){
   pokeCards.indexOf(card) === pokeCards.length - 1 ? setCard(pokeCards[0]) : setCard(pokeCards[pokeCards.indexOf(card) + 1]);

  }
  else if(type === 'Trainer'){
    trainerCards.indexOf(card) === trainerCards.length - 1 ? setCard(trainerCards[0]) : setCard(trainerCards[trainerCards.indexOf(card) + 1]);
  }
  else{
    energyCards.indexOf(card) === energyCards.length - 1 ? setCard(energyCards[0]) : setCard(energyCards[energyCards.indexOf(card) + 1]);
  }
}

const prevCard = (card, type) => {

  if(type === 'Pokémon'){
pokeCards.indexOf(card) === 0 ? setCard(pokeCards[pokeCards.length - 1]) : setCard(pokeCards[pokeCards.indexOf(card) - 1]);
  }
  else if(type === 'Trainer'){
   trainerCards.indexOf(card) === 0 ? setCard(trainerCards[trainerCards.length - 1]) : setCard(trainerCards[trainerCards.indexOf(card) - 1]);
  }
  else{
    energyCards.indexOf(card) === 0 ? setCard(energyCards[energyCards.length - 1]) : setCard(energyCards[energyCards.indexOf(card) - 1]);
  }
}




const addCards = card => {
  if(!deck.cards.includes(deck.cards.find(c => c.id === card.id))){
   
    setDeck(oldState => ({cards: [...oldState.cards, {...card, count: 1}], deckInfo: { ...oldState.deckInfo, [card.supertype]: deck.deckInfo[card.supertype] + 1, totalCards: deck.deckInfo.totalCards + 1 }}));
    card.count = card.count + 1;
    setDeckCounter(deckCounter + 1);
  }
  else{
    setDeck(oldState => ({cards: [...oldState.cards], deckInfo: {...oldState.deckInfo, [card.supertype]: deck.deckInfo[card.supertype] + 1, totalCards: deck.deckInfo.totalCards + 1}}));
    card.count = card.count + 1;
    setDeckCounter(deckCounter + 1);
  }

}

const subtractCards = card => {

  if(card.count === 1){
    setDeck(oldState => ({cards: deck.cards.filter(c => c.id !== card.id), deckInfo: { ...oldState.deckInfo, [card.supertype]: deck.deckInfo[card.supertype] - 1, totalCards: deck.deckInfo.totalCards - 1 }}));
    setDeckCounter(deckCounter - 1);

  }
  else{
    card.count = card.count - 1;
    deck.deckInfo.totalCards = deck.deckInfo.totalCards - 1;
    deck.deckInfo[card.supertype] = deck.deckInfo[card.supertype] -1;
    setDeckCounter(deckCounter - 1);
  }

}
const removeCard = card => {
  setDeck(oldState => ({cards: deck.cards.filter(c => c.id !== card.id), deckInfo: { ...oldState.deckInfo, [card.supertype]: deck.deckInfo[card.supertype] - 1, totalCards: deck.deckInfo.totalCards - 1 }}));
}

const toggleDeckMobile = () => {
  if(mobileInfo){
    toggleDeckManager();
    document.getElementById('deck').classList.toggle('active')
    document.getElementById('mobileDeckInfoBtn').classList.toggle('active')
    setMobileInfo(!mobileInfo);
    setMobileDeck(!mobileDeck);
  }
  else{
    document.getElementById('deck').classList.toggle('active')
    setTimeout(document.getElementById('mobileDeckInfoBtn').classList.toggle('active'), 1000)
  }

}

const toggleDeckManager = () => {
  document.getElementById('deckManager').classList.toggle('active');
  setMobileInfo(!mobileInfo);
}

const toggleModal = () => {
document.getElementById('modalBgOverlay').classList.toggle('open');
  document.getElementById('modal').classList.toggle('open');
}
const dropDown = () => {
  document.getElementById('dropDownContent').classList.toggle('active');
}

const saveDeck = () => {
  setSavedDecks(oldState => [...oldState, {...deck, deckInfo: {...deck.deckInfo, deckName: deckNameInput}}]);
}

useEffect(() => {

  if(!sets){
    Axios.get(`https://api.pokemontcg.io/v1/sets`)
    .then(res => {
      setSets(res.data.sets)
    })
  }

  localStorage.setItem('savedDecks', JSON.stringify(savedDecks))

    },[savedDecks, sets]);
  


  return (
    <div className="App">


<Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
<TabList>
  <Tab>Sets</Tab>
  {!pokeCards ? <Tab disabled={true}>Pokémon</Tab> : <Tab>Pokémon</Tab>}
  {!trainerCards ? <Tab disabled={true}>Trainer</Tab> : <Tab>Trainer</Tab>}
  {!energyCards ? <Tab disabled={true}>Energy</Tab> : <Tab>Energy</Tab>}
 <div className='searchContainer'>
 
   <Autocomplete text={text} selectSet={selectSet} currentSetCode={currentSetCode} setText={setText} cards={cards} setCards={setCards} suggestions={suggestions} setSuggestions={setSuggestions} setPokeCards={setPokeCards} setTrainerCards={setTrainerCards} setEnergyCards={setEnergyCards} setTabIndex={setTabIndex}/></div> 
 <div className='logoContainer'><img className='logo' src={ptcgLogo} alt='PTCG Logo'/></div>
</TabList>

<div className='panelContainer'>

<TabPanel>
  
<div className='mobileSearchContainer'>

<Autocomplete text={text} selectSet={selectSet} currentSetCode={currentSetCode} setText={setText} cards={cards} setCards={setCards} suggestions={suggestions} setSuggestions={setSuggestions} setPokeCards={setPokeCards} setTrainerCards={setTrainerCards} setEnergyCards={setEnergyCards} setTabIndex={setTabIndex}/>
</div> 
          <div id='sets' className='cards'>
            <ul>
              {sets && sets.map(set =>
                <li id={set.code} onClick={() => {selectSet(set.code);  }}>
                  <img className='setLogos' src={set.logoUrl} alt={set.name}/>
                  <p id='setName'>{set.name}</p>
                  <p id='setSeries'>{'Series: ' + set.series}</p>
                  <p id='setReleaseDate'>{'Released: ' + set.releaseDate}</p>
                </li>)}
            </ul>
          </div>    
</TabPanel>
<TabPanel>



<div className='mobileSearchContainer'>

   <Autocomplete text={text} selectSet={selectSet} currentSetCode={currentSetCode} setText={setText} cards={cards} setCards={setCards} suggestions={suggestions} setSuggestions={setSuggestions} setPokeCards={setPokeCards} setTrainerCards={setTrainerCards} setEnergyCards={setEnergyCards} setTabIndex={setTabIndex}/>
   </div> 



  {!cards ? null : pokeCards.length === 0  ? <div>No Pokémon Cards in this set.</div> :



  
  <div id='pokemon' className='cards'>
    
            <ul>
            {pokeCards && pokeCards.map(card =>

              <li className='card' onClick={() =>{ setCard(card); toggleModal()} }>
  <img src={card.imageUrl} alt={card.name}/>
              </li>   )}


            </ul>
          </div>


 }
</TabPanel>
<TabPanel>
<div className='mobileSearchContainer'>
  
   <Autocomplete text={text} selectSet={selectSet} currentSetCode={currentSetCode} setText={setText} cards={cards} setCards={setCards} suggestions={suggestions} setSuggestions={setSuggestions} setPokeCards={setPokeCards} setTrainerCards={setTrainerCards} setEnergyCards={setEnergyCards} setTabIndex={setTabIndex}/>
   </div> 

<div id='trainer' className='cards'>
            <ul >
              {trainerCards && trainerCards.map(card =>
                <li onClick={() =>{ setCard(card); toggleModal()} }>
                        <img src={card.imageUrl} alt={card.name}/>
                       </li>)}
            </ul>
          </div>

</TabPanel>
<TabPanel>
<div className='mobileSearchContainer'>

   <Autocomplete text={text} selectSet={selectSet} currentSetCode={currentSetCode} setText={setText} cards={cards} setCards={setCards} suggestions={suggestions} setSuggestions={setSuggestions} setPokeCards={setPokeCards} setTrainerCards={setTrainerCards} setEnergyCards={setEnergyCards} setTabIndex={setTabIndex}/>
   </div> 

<div id='energy' className='cards'>
            <ul >
              {energyCards && energyCards.map(card =>
                <li onClick={() =>{ setCard(card); toggleModal()} }>
                  <img src={card.imageUrl} alt={card.name}/>
                </li>)}
            </ul>
          </div>

</TabPanel>



<div id='deck' className='deck'>
<h1 className='deckTitle'>Deck<hr/></h1>
{deck.deckInfo.totalCards === 0 ? <div  className='currentDeck'>Your deck is empty.  Choose cards to add to your deck.</div> : 

<div className='currentDeck'>

            <ul>
              {deck && deck.cards.map(c =>
                <li>
          
                <p>{c.name}</p>
                <div className='deckCardControls'>
                <div className='cardIconContainer'><img className='cardIcon' src={cardIcon} alt='view larger' onClick={() => {toggleModal(); setCard(c)}}/>  <img className='trash' src={trash} alt='trash' onClick={() => removeCard(c)}/></div>
                
                  <div id='cardCounter'>
              <p>{c.count}</p>
                    <div id='counterBtns'>
                      <button onClick={() => addCards(c)} ><img src={upArrow} alt='up arrow'/></button>
                      <button onClick={() => subtractCards(c)}><img src={downArrow} alt='down arrow'/></button>
                    </div>
                  </div>
                  </div>
                </li>)}
            </ul>
           </div>
     }

          <div  id='deckManager' className='deckManager'>
            <button id='deckManagerCloseBtn' className='close' onClick={() => toggleDeckManager()}>X</button>
            <h1>Save Deck</h1>
            <div className='deckSaver'>
            <form onSubmit={e =>
               { e.preventDefault();
                setDeck(oldState => ({...oldState, deckInfo: {...oldState.deckInfo, deckName: [deckNameInput]}}));     
                 setDeckNameInput('');
                 saveDeck();
                  }}>

    <input type='text' name='deckName' placeholder='Enter deck name' onChange={e =>  setDeckNameInput(e.target.value)} value={deckNameInput} required maxLength='20'/>
    <button type='submit' className='saveBtn'>Save</button>
  </form>
            </div>
            <h1>Load Deck</h1>

 <div className='deckLoader'>
    <button className='dropDownBtn' onClick={() => dropDown()}>{deckSelected ? <div><p>{deckSelected.deckInfo.deckName}</p><p className='cardAmount'>Cards: {deckSelected.deckInfo.totalCards}</p></div> : <p>Click to view saved decks</p>}</button>
    <div id='dropDownContent'><ul>{savedDecks.map(d => <li className='dropDownItem' onClick={() => {setDeckSelected(d); dropDown()}}><p>{d.deckInfo.deckName}</p><p className='cardAmount'>Cards: {d.deckInfo.totalCards}</p></li>)}</ul></div>
   <button className='loadBtn' onClick={() =>{ setDeck(deckSelected); setDeckCounter(deckSelected.deckInfo.totalCards)}}>Load</button>
 </div>

 <div className='deckInfo'>
   <ul>
    <li>Deck Name: {deck.deckInfo.deckName}</li>
     <li>Total Cards: {deck.deckInfo.totalCards}</li>
    <li>Pokemon Cards: {deck.deckInfo.Pokémon}</li>
     <li>Trainer Cards: {deck.deckInfo.Trainer}</li>
     <li>Energy Cards: {deck.deckInfo.Energy}</li>
     <li></li>

   </ul>
 
 </div>

          </div>
       
          </div>
          </div>
          <hr className='underline'/>
          <div className='footer'><p>PTCG Deck Builder built with the PTCG Api.</p><p>© 2020 Pokémon</p></div>

</Tabs>


<button id='mobileDeckInfoBtn' onClick={() => toggleDeckManager()}>i</button>
                <button className='mobileDeckManagerBtn' onClick={() => toggleDeckMobile()}>{deck.deckInfo.totalCards === 0 ? <p>0/60</p> : <p>{deck.deckInfo.totalCards}/60</p>}<img src={cardsPic} alt='deckCount'/></button>



<div id='modal' className='largerImgDisplay'>
  <button className='close' onClick={() => toggleModal()}>X</button>
    <div>

{!card ? null : <img src={card.imageUrlHiRes} alt='hi resolution'/> }  
 
    </div>
{!card ? null : <p className='name'>{card.name}</p>}
    <div className='hiResButtonContainer'>
      <div className='nextPrev'>
    <button onClick={() => card ? prevCard(card, card.supertype) : null}>Prev</button>
    <button onClick={() => card ? nextCard(card, card.supertype) : null}>Next</button>
   </div>
   <button onClick={() => deck.cards.includes(deck.cards.find(c => c.id === card.id)) ? addCards(deck.cards.find(c => c.id === card.id)) : (addCards(card), toggleModal()) }>Add to deck</button>

    </div>
 
  
   
<div className='deckInfoModal'>{deck.deckInfo.deckName ? <p>Deck: {deck.deckInfo.deckName}</p> : null} <p><img id='cardsImg' src={cardsPic} alt='deck count'/> {deck.deckInfo.totalCards}/60</p></div>
  </div>
  <div id='modalBgOverlay' onClick={() => toggleModal()}></div>
    </div>
  );
}

export default App;
