import './App.css';
import Element from "./Element"
import elements from "./Elements"
import styled from "styled-components"
import { useRef, useState } from "react"


function App() {
	/**
	 * List all matches, but only fill in the ones that don't overlap.
	 * Using my name (Kristian) as an example, Potassium (K) and Krypton (Kr) would *not* be auto-filled, giving me the option to choose.
	 * Iodine (I) on the other hand will not overlap, so it gets added automatically.
	 */
	const input = useRef(null)
	const [currentInput, setCurrentInput] = useState("")
	const [elementName, setElementName] = useState("")
	const [matches, setMatches] = useState([])
	const [norwegian, setNorwegian] = useState(false)
	const [selectedElements, setSelectedElements] = useState([])
	const [takenIndices, setTakenIndices] = useState([])
	const [uniqueMatches, setUniqueMatches] = useState([])

	const allProps = {
		input,
		currentInput, setCurrentInput,
		elementName, setElementName,
		matches, setMatches,
		norwegian, setNorwegian,
		selectedElements, setSelectedElements,
		takenIndices, setTakenIndices,
		uniqueMatches, setUniqueMatches,
	}

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
			.map(function findIndexAndReach(current) {
				const indexInName = lowerCaseName.indexOf(current.symbol.toLowerCase())
				const indexInNamePlusLength = indexInName + current.symbol.length - 1
				return { match: current, indexInName, indexInNamePlusLength }
			})
			.filter(function removeIfOverlapping(currentElement, index, array) {
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

	function showMatchingElementsForLetter(character) {
		const characterMatches = matches.filter(e => e.symbol.toLowerCase().includes(character))
		setAvailableElements()
	}

	function toggleNorsk() {
		setNorwegian(!norwegian)
		input.current.checked = norwegian
	}

	return (
		<div className="App">
			<NorskToggle htmlFor="norsk">
				🇳🇴 Norsk
				<input type="checkbox" name="norsk" id="norsk" onChange={toggleNorsk} autoFocus />
			</NorskToggle>

			<input type="text" name="query" id="query" onKeyUp={getMatches} autoFocus ref={input} />

			<div className="all-matches">
				<h1>{norwegian ? `${currentInput} inneholder:` : `${currentInput} contains:`}</h1>
				{matches.map(element => (
					<Element {...{ allProps }} {...{ element }} />
				))}
				<p>
					{norwegian ?
						"Bilder: Keith Enevoldsens interaktive periodesystem: "
						:
						"Images: Keith Enevoldsen's interactive periodic table: "
					}
					<a href="https://elements.wlonk.com/ElementsTable.htm">elements.wlonk.com</a>
				</p>
			</div>

			<div className="characters">
				<h1>{norwegian ? "Kjeminavnet ditt:" : "Your chemical name:"}</h1>
				<p>{norwegian ?
					"Trykk på bokstavene nedenfor for å sette sammen ditt kjemiske navn!"
					:
					"Click the letters below to create your own chemical name!"
				}</p>

				{currentInput.split("").map(character => (
					<pre
						onClick={() => showMatchingElementsForLetter(character)}
						style={{ display: "inline" }}
					>
						{character}
					</pre>
				))}
				{/* <Element {...allProps} /> */}
			</div>
		</div >
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
