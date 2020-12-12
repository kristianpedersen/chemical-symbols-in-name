import './App.css';
import Element from "./Element"
import elements from "./Elements"
import SvgOutput from "./SvgOutput"
import styled from "styled-components"
import { useRef, useState } from "react"

function App() {
	const input = useRef(null)
	const svgImage = useRef(null)
	const [currentInput, setCurrentInput] = useState("")
	const [indices, setIndices] = useState([])
	const [matches, setMatches] = useState([])
	const [norwegian, setNorwegian] = useState(false)
	const [overlapIndices, setOverlapIndices] = useState([])
	const [selectedElements, setSelectedElements] = useState([])

	const allProps = {
		input,
		svgImage,
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
		const svgAsXML = (new XMLSerializer).serializeToString(svgImage.current);
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
			<div className="input-area">
				<NorskToggle htmlFor="norsk">
					🇳🇴 Norsk
				<input type="checkbox" name="norsk" id="norsk" onChange={toggleNorsk} autoFocus />
				</NorskToggle>

				<input type="text" name="query" id="query" onKeyUp={getMatches} autoFocus ref={input} />
				<h1>{norwegian ? `${currentInput} inneholder:` : `${currentInput} contains:`}</h1>
			</div>

			<div className="matches">
				{matches.map(element => (
					<Element {...{ allProps }} {...{ element }} />
				))}
			</div>
			<p>
				{norwegian ?
					"Bildene er lagd av Keith Enevoldsen: "
					:
					"The images are made by Keith Enevoldsen: "
				}
				<a href="https://elements.wlonk.com/ElementsTable.htm">elements.wlonk.com</a>
			</p>

			<div className="characters">
				<h1>{norwegian ? "Grunnstoffnavnet ditt er:" : "Your elemental name is:"}</h1>
				{/* <button onClick={downloadSVG}>
					{norwegian ? "Last ned .svg" : "Download .svg"}
				</button> */}
				<SvgOutput {...allProps} />
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
