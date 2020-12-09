import './App.css';
import Element from "./Element"
import elements from "./Elements"
import styled from "styled-components"
import { useRef, useState } from "react"

function App() {
	const input = useRef(null)
	const [currentInput, setCurrentInput] = useState("")
	const [indices, setIndices] = useState([])
	const [matches, setMatches] = useState([])
	const [norwegian, setNorwegian] = useState(false)
	const [overlapIndices, setOverlapIndices] = useState([])
	const [selectedElements, setSelectedElements] = useState([])

	const allProps = {
		input,
		currentInput, setCurrentInput,
		indices, setIndices,
		matches, setMatches,
		norwegian, setNorwegian,
		overlapIndices, setOverlapIndices,
		selectedElements, setSelectedElements,
	}

	function getMatches(event) {
		setSelectedElements([])
		setOverlapIndices([])
		setIndices([])
		document.querySelectorAll("input").forEach(i => i.checked = false)
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

		const noOverlap = allMatches.map(
			function findIndexAndReach(current) {
				const indexInName = lowerCaseName.indexOf(current.symbol.toLowerCase())
				const indexInNamePlusLength = indexInName + current.symbol.length - 1
				return { match: current, indexInName, indexInNamePlusLength }
			})
			.filter(
				function removeIfOverlapping(currentElement, index, array) {
					const otherElements = [...array.slice(0, index), ...array.slice(index + 1)]
					return otherElements.every(e => {
						const previousDoesntOverlapCurrent = (e.indexInNamePlusLength !== currentElement.indexInName)
						const currentDoesntOverlapNext = (e.indexInName !== currentElement.indexInNamePlusLength)
						return previousDoesntOverlapCurrent && currentDoesntOverlapNext
					})
				})
			.map(e => e.match)

		setMatches(allMatches)
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
				<svg
					width={(currentInput.length) * 150}
					height={200}
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						width={currentInput.length * 100}
						height={100}
						fill="white"
					/>
					{/* https://stackoverflow.com/a/57567670 */}
					<foreignObject x={0} y={0} width={currentInput.length * 150} height={200}>
						<body xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: "serif", fontSize: "24px", textAlign: "left" }}>
							{currentInput.split("")
								.reduce((accumulator, current, index) => {
									const currentElement = selectedElements[accumulator.elementIndex]
									const indexMatch = indices.includes(index)
									const overlapMatch = overlapIndices.includes(index)

									if (currentElement !== undefined && indexMatch && overlapMatch) {
										accumulator.name.push(
											<span style={{ background: "lightgreen", border: "1px solid green", display: "inline-block", width: 100, height: 100 }}>
												{currentElement.symbol}
											</span>
										)
										accumulator.elementIndex++
										if (currentElement.indices.length === 2) {
											accumulator.skipCharIndex.push(index + 1)
										}
									} else if (!accumulator.skipCharIndex.includes(index)) {
										accumulator.name.push(<span style={{ display: "inline-block", width: 100, height: 100 }}>{current}</span>)
									}
									return accumulator
								}, { name: [], elementIndex: 0, skipCharIndex: [] }).name.map(e => e)
							}
						</body>
					</foreignObject>
				</svg>
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
