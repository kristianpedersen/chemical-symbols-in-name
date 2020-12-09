import './App.css';
import Element from "./Element"
import elements from "./Elements"
import styled from "styled-components"
import { useRef, useState } from "react"

function App() {
	const input = useRef(null)
	const img = useRef(null)
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
		document.querySelectorAll("input").forEach(i => i.id !== "norsk" ? i.checked = false : i.checked = norwegian)

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

		setMatches(allMatches)
	}

	function downloadSVG() {
		// http://bl.ocks.org/curran/7cf9967028259ea032e8
		const svgAsXML = (new XMLSerializer).serializeToString(img.current);
		var dl = document.createElement("a");
		document.body.appendChild(dl); // This line makes it work in Firefox.
		dl.setAttribute("href", "data:image/svg+xml," + encodeURIComponent(svgAsXML));
		dl.setAttribute("download", "test.svg");
		dl.click();
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
				<h1>{norwegian ? "Grunnstoffnavnet ditt er:" : "Your elemental name is:"}</h1>
				{/* <button >{norwegian ? "Last ned .svg" : "Download .svg"}</button> */}
				<svg
					width={window.innerWidth}
					height={252}
					xmlns="http://www.w3.org/2000/svg"
					ref={img}
				>
					{/* https://stackoverflow.com/a/57567670 */}
					<foreignObject x={0} y={0} width={window.innerWidth} height={252}>
						<body xmlns="http://www.w3.org/1999/xhtml">
							{currentInput.split("")
								.reduce((accumulator, current, index, array) => {
									const currentElement = selectedElements[accumulator.elementIndex]
									const indexMatch = indices.includes(index)
									const overlapMatch = overlapIndices.includes(index)
									const lastIndex = index === array.length - 1

									if (currentElement !== undefined && indexMatch && overlapMatch) {
										const elementInfo = matches.find(m => m.symbol === currentElement.symbol)
										console.log(elementInfo)
										accumulator.name.push(
											<div style={{
												backgroundColor: "hsl(90, 100%, 90%)",
												border: "solid green",
												borderWidth: lastIndex ? "1px" : "1px 0 1px 1px",
												display: "inline-block",
												fontSize: "24px",
												width: 110,
												height: 250
											}}>
												<p>{elementInfo.number}</p>
												<p className="symbol">{elementInfo.symbol}</p>
												<p className="sml">{norwegian ? elementInfo.norsk || elementInfo.name : elementInfo.name}</p>
												<p className="sml">{elementInfo.atomic_mass}</p>
												<p className="sml">{elementInfo.shells.join("-")}</p>
											</div>
										)
										accumulator.elementIndex++
										if (currentElement.indices.length === 2) {
											accumulator.skipCharIndex.push(index + 1)
										}
									} else if (!accumulator.skipCharIndex.includes(index)) {
										console.log(current)
										accumulator.name.push(
											<div style={{
												border: "solid green",
												borderWidth: lastIndex ? "1px" : "1px 0 1px 1px",
												display: "inline-block",
												fontSize: "24px",
												width: 110,
												height: 250
											}}>
												<p>&nbsp;</p>
												<p className="symbol">{current} &nbsp;</p>
												<p className="sml">&nbsp;</p>
												<p className="sml">&nbsp;</p>
												<p className="sml">&nbsp;</p>
											</div>
										)
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
