import styled from "styled-components"

export default function Element(props) {
	const element = props.element
	const {
		currentInput,
		norwegian,
		setIndices,
		overlapIndices, setOverlapIndices,
		selectedElements, setSelectedElements,
	} = props.allProps

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
			// Sorted, because otherwise their order depends on when the checkboxes were clicked
			setIndices(prev => [...prev, position]
				.sort((a, b) => a - b)
			)
			setOverlapIndices(prev => [...prev, ...indices]
				.sort((a, b) => a - b)
			)
			setSelectedElements(prev => {
				return [...prev, { symbol, indices }]
					.sort((a, b) => a.indices[0] - b.indices[0])
			})
		} else {
			setIndices(prev => prev.filter(i => !indices.includes(i)))
			setOverlapIndices(prev => prev.filter(i => !indices.includes(i)))
			setSelectedElements(prev => {
				return prev.filter(p => p.indices[0] !== position)
			})
		}
	}

	return (
		// <></>
		<ElementDiv>
			<img src={`/chemical-symbols-in-name/assets/e${String(element.number).padStart(3, "0")}.png`} />
			<h2>{norwegian ? element.norsk || element.name : element.name}</h2>
			<p>({element.number}) (<span className="symbol">{element.symbol}</span>)</p>

			{getPositionIndices(element.symbol).map(index => {
				// Create an array with either one or two indices, to correctly register two-character symbols 
				const currentIndices = [...Array(element.symbol.length)].map((_, i) => index + i)
				const inactiveClass = currentIndices.some(currentIndex => overlapIndices.includes(currentIndex)) ? "inactive" : ""

				return (
					<label className={inactiveClass}>
						<input
							className={inactiveClass}
							disabled={
								inactiveClass === "inactive"
								&& overlapIndices.some(i => currentIndices.includes(i))
								&& selectedElements.length >= 1
								&& !selectedElements.some(s => s.symbol === element.symbol && s.indices[0] === index)
							}
							name="btn"
							onClick={event => togglePosition(event, element.symbol, index)}
							type="checkbox"
						/>
						{index + 1}
					</label>
				)
			})}
		</ElementDiv>
	)
}

const ElementDiv = styled.div`
	border: 1px solid #999;
	flex: 1;
	
	min-width: 0;
	min-height: 0;
	margin: 0 .5rem;
	padding: .5rem;
`