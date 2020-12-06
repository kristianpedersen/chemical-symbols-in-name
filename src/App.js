import './App.css';
import elements from "./Elements"
import styled from "styled-components"
import { useState } from "react"

function App() {
	/**
	 * List all matches, but only fill in the ones that don't overlap.
	 * Using my name (Kristian) as an example, Potassium (K) and Krypton (Kr) would *not* be auto-filled, giving me the option to choose.
	 * Iodine (I) on the other hand will not overlap, so it gets added automatically.
	 */
	const [matches, setMatches] = useState([])
	const [uniqueMatches, setUniqueMatches] = useState([])
	const [currentInput, setCurrentInput] = useState("")
	const [norwegian, setNorwegian] = useState(false)

	function getMatches(event) {
		const lowerCaseName = event.target.value.toLowerCase()
		setCurrentInput(event.target.value)

		const allMatches = elements
			.filter(function findElementInName(element) {
				return lowerCaseName.includes(element.symbol.toLowerCase())
			})
			.sort(function sortElementsByOrderOfAppearance(a, b) {
				const aIndex = lowerCaseName.indexOf(a.symbol.toLowerCase())
				const bIndex = lowerCaseName.indexOf(b.symbol.toLowerCase())
				return aIndex - bIndex
			})

		const noOverlap = allMatches
			.map(function findIndexAndIndexPlusLenght(current) {
				const indexInName = lowerCaseName.indexOf(current.symbol.toLowerCase())
				const indexInNamePlusLength = indexInName + current.symbol.length - 1
				return { match: current, indexInName, indexInNamePlusLength }
			})
			.filter((currentElement, index, array) => {
				const otherElements = [...array.slice(0, index), ...array.slice(index + 1)]
				return otherElements.every(e => {
					const previousDoesntOverlapCurrent = (e.indexInNamePlusLength !== currentElement.indexInName)
					const currentDoesntOverlapNext = (e.indexInName !== currentElement.indexInNamePlusLength)
					return previousDoesntOverlapCurrent && currentDoesntOverlapNext
				})
			}).map(e => e.match)

		setMatches(allMatches)
		setUniqueMatches(noOverlap)
	}

	function toggleNorsk(event) {
		setNorwegian(!norwegian)
		event.target.checked = norwegian
	}

	return (
		<div className="App">
			{/* <NorskToggle htmlFor="norsk">
				🇳🇴 Norske elementnavn, takk!
				<input type="checkbox" name="norsk" id="norsk" onChange={toggleNorsk} autoFocus />
			</NorskToggle> */}

			<input type="text" name="query" id="query" onChange={getMatches} autoFocus />

			<div className="all-matches">
				<h1>All matches</h1>
				{matches.map(e => <p>({e.number}) {e.name} (<span className="symbol">{e.symbol}</span>)</p>)}
			</div>
			<div className="unique-matches">
				<h1>Matches without overlap</h1>
				{uniqueMatches.map(e => <p>({e.number}) {e.name} (<span className="symbol">{e.symbol}</span>)</p>)}
			</div>

			{/* <div className="characters">
				<pre>{currentInput}</pre>
			</div> */}
		</div>
	);
}

const NorskToggle = styled.label`
	background: hsl(200, 50%, 95%);
	box-shadow: 0 1px 1px rgba(0,0,0,0.04), 
              0 2px 2px rgba(0,0,0,0.04), 
              0 4px 4px rgba(0,0,0,0.04), 
              0 8px 8px rgba(0,0,0,0.04),
			  0 16px 16px rgba(0,0,0,0.04);
	padding: 1rem;
`

export default App;
