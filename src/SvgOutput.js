import { SVG } from "@svgdotjs/svg.js"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"

export default function SvgOutput(allProps) {
	const {
		currentInput,
		indices,
		matches,
		norwegian,
		overlapIndices,
		selectedElements,
		svgImage,
	} = allProps
	const [svgElements, setSvgElements] = useState({ _id: "svg-elements", data: [] })
	const svgContainer = useRef(null)

	useEffect(() => {
		const svgs = currentInput
			.split("")
			.reduce(function createSvgs(accumulator, current, index) {
				const currentElement = selectedElements[accumulator.elementIndex]
				const indexMatch = indices.includes(index)
				const overlapMatch = overlapIndices.includes(index)

				if (currentElement !== undefined && indexMatch && overlapMatch) {
					const elementInfo = matches.find(m => m.symbol === currentElement.symbol)
					accumulator.name.push(
						<ElementDiv style={{ background: "lightgreen", minWidth: "100px" }}>
							<p>{elementInfo.number}</p>
							<p className="symbol">{elementInfo.symbol}</p>
							<p className="sml">{norwegian ? elementInfo.norsk || elementInfo.name : elementInfo.name}</p>
							<p className="sml">{elementInfo.atomic_mass}</p>
							<p className="sml">{elementInfo.shells.join("-")}</p>
						</ElementDiv>
					)
					accumulator.elementIndex++
					if (currentElement.indices.length === 2) {
						accumulator.skipCharIndex.push(index + 1)
					}
				} else if (!accumulator.skipCharIndex.includes(index)) {
					accumulator.name.push(
						<ElementDiv style={{ background: current === " " ? "white" : "hsl(90, 50%, 90%)" }}>
							<p>&nbsp;</p>
							<p className="symbol" style={{ minWidth: "50px" }}>{current}</p>
							<p className="sml">&nbsp;</p>
							<p className="sml">&nbsp;</p>
							<p className="sml">&nbsp;</p>
						</ElementDiv >
					)
				}
				return accumulator
			}, { name: [], elementIndex: 0, skipCharIndex: [] }).name

		setSvgElements(svgs)
	}, [currentInput, indices, matches, norwegian, overlapIndices, selectedElements])

	return (
		<svg ref={svgImage} xmlns="http://www.w3.org/2000/svg" width={window.innerWidth} height="500">
			<foreignObject x={0} y={0} width={window.innerWidth} height={500}>
				<SvgContainer>
					{currentInput.length >= 1 && svgElements.map(e => e)}
				</SvgContainer>
			</foreignObject>
		</svg >
	)
}

const ElementDiv = styled.div`
	border-radius: 5px;
	border: 1px solid green;
	display: "inline-block";
	/* margin: 0 .25rem; */
	text-align: center;
`

const SvgContainer = styled.div`
	display: flex;
	justify-content: center;
`