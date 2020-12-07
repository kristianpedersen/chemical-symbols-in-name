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
	const [matches, setMatches] = useState([])
	const [norwegian, setNorwegian] = useState(false)
	const [uniqueMatches, setUniqueMatches] = useState([])

	const allProps = {
		input,
		currentInput, setCurrentInput,
		matches, setMatches,
		norwegian, setNorwegian,
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
				<h1>{norwegian ? `Hei, ${currentInput}! Navnet ditt består av:` : `Hi, ${currentInput}! Your name is made up of:`}</h1>
				{matches.map(e => {
					return (
						<div className="element" style={{ display: "inline-block", padding: "0 .5rem 0 .5rem", margin: "0 .5rem 0 .5rem", border: "1px solid" }}>
							<img src={`/assets/e${String(e.number).padStart(3, "0")}.png`} width={100} />
							<h2>{norwegian ? e.norsk || e.name : e.name}</h2>
							<p>({e.number}) (<span className="symbol">{e.symbol}</span>)</p>
						</div>
					)
				})}
				<p>
					{norwegian ?
						"Bilder hentet fra Keith Enevoldsens interaktive periodesystem: "
						:
						"Images retrieved from Keith Enevoldsen's interactive periodic table: "
					}
					<a href="https://elements.wlonk.com/ElementsTable.htm">elements.wlonk.com</a></p>
				{/* <p>{norwegian ?
					"Trykk på bokstavene nedenfor for å sette sammen ditt kjemiske navn!"
					:
					"Click the letters below to create your own chemical name!"
				}</p>
			</div>

			<div className="characters">
				<h1>{norwegian ? "Kjeminavnet ditt" : "Your chemistry name"}</h1>
				<pre>{currentInput}</pre>
				<Element {...allProps} />
			</div> */}
			</div>
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
