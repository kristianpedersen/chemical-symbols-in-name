import { useState } from "react"
import styled from "styled-components"

export default function Element(props) {
	const {
		currentInput,
		norwegian,
		selectedElements, setSelectedElements,
		takenIndices, setTakenIndices,
	} = props.allProps
	const element = props.element
	const [availableName, setAvailableName] = useState(currentInput)

	function getPositionIndices(symbol) {
		const inputChars = currentInput.split("")
		return inputChars.reduce((indices, current, index, array) => {
			if (symbol.length === 1 && current.toLowerCase() === symbol.toLowerCase()) {
				indices.push(index)
			}
			else if (symbol.length === 2 && index < array.length - 1) {
				const curr = current.toLowerCase()
				const next = array[index + 1].toLowerCase()
				if (curr + next === symbol.toLowerCase()) {
					indices.push(index)
				}
			}
			return indices
		}, [])
	}

	function togglePosition(event, symbol, position) {
		const indices = [...Array(symbol.length)].map((_, i) => position + i)

		if (event.target.checked) {
			setSelectedElements(prev => [...prev, symbol])
			setTakenIndices(prev => [...prev, ...indices])
		} else {
			setSelectedElements(prev => prev.filter(s => s !== symbol))
			setTakenIndices(prev => prev.filter(i => !indices.includes(i)))
		}
	}

	return (
		// <></>
		<ElementDiv>
			<img src={`/chemical-symbols-in-name/assets/e${String(element.number).padStart(3, "0")}.png`} width={150} />
			<h2>{norwegian ? element.norsk || element.name : element.name}</h2>
			<p>({element.number}) (<span className="symbol">{element.symbol}</span>)</p>

			<h2>Taken indices</h2>

			{getPositionIndices(element.symbol).map(index => {
				const cn = takenIndices.includes(index) ? "strike" : ""
				return (
					<label className={cn}>
						<input
							className={cn}
							disabled={cn === "strike" && !selectedElements.includes(element.symbol) && selectedElements.length > 1}
							name="btn"
							onClick={event => togglePosition(event, element.symbol, index)}
							type="checkbox"
						/>
						{index}
					</label>
				)
				// return <button onClick={togglePosition}>{index}</button>
			})}
		</ElementDiv>
	)
}

const ElementDiv = styled.div`
	border: 1px solid #999;
	display: inline-block;
	margin: 0 .5rem;
	padding: .5rem;

	&:hover {
		background: hsl(30, 100%, 90%);
	}
`