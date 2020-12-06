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
	const [autoFillMatches, setAutoFillMatches] = useState([])
	const [currentInput, setCurrentInput] = useState("")
	const [norwegian, setNorwegian] = useState(false)

	function getMatches(event) {
		const lowerCaseName = event.target.value.toLowerCase()
		setCurrentInput(event.target.value)

		const allMatches = elements
			// Get all matching elements with all their information
			.filter(element => lowerCaseName.includes(element.symbol.toLowerCase()))
			// Sort by order in input name, rather than periodic table order
			.sort((a, b) => {
				const aIndex = lowerCaseName.indexOf(a.symbol.toLowerCase())
				const bIndex = lowerCaseName.indexOf(b.symbol.toLowerCase())
				return aIndex - bIndex
			})

		const uniqueMatches = allMatches.reduce((accumulator, currentElement, index, array) => {
			if (index > 0 && index < array.length - 1) {
				const previousElement = array[index - 1]
				const nextElement = array[index + 1]

				const prev = previousElement.symbol.toLowerCase()
				const curr = currentElement.symbol.toLowerCase()
				const next = nextElement.symbol.toLowerCase()

				const previousReach = lowerCaseName.indexOf(prev) + prev.length - 1
				const currentReach = lowerCaseName.indexOf(curr) + curr.length - 1

				const currentIndex = lowerCaseName.indexOf(curr)
				const nextIndex = lowerCaseName.indexOf(next)

				if (index === 1 && previousReach < currentIndex) {

				} else if (index === array.length - 2 && currentReach < nextIndex)

					if (previousReach < currentIndex && currentReach < nextIndex) {
						if (index === 1) {
							accumulator.push(previousElement, currentElement)
						} else if (index === array.length - 2) {
							accumulator.push(currentElement, nextElement)
						} else {
							accumulator.push(currentElement)
						}
					}
			}
			return accumulator
		}, [])

		setMatches(allMatches)
		setAutoFillMatches(uniqueMatches)
	}

	function toggleNorsk(event) {
		setNorwegian(!norwegian)
		event.target.checked = norwegian
	}

	return (
		<div className="App">
			<NorskToggle htmlFor="norsk">
				🇳🇴 Norske elementnavn, takk!
				<input type="checkbox" name="norsk" id="norsk" onChange={toggleNorsk} />
			</NorskToggle>

			<hr />

			<input type="text" name="query" id="query" onChange={getMatches} autoFocus />

			<div className="all-matches">
				<h1>All matches</h1>
				{matches.map(e => <p>({e.number}) {e.name} ({e.symbol})</p>)}
			</div>
			<div className="unique-matches">
				<h1>Unique matches</h1>
				{autoFillMatches.map(e => <p>({e.number}) {e.name} ({e.symbol})</p>)}
			</div>

			<div className="characters">
				<pre>{currentInput}</pre>
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
