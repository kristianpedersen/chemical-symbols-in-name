import elements from "./Elements"

export default function Element({ id, norwegian }) {
	const randomElement = elements[Math.floor(Math.random() * elements.length)]
	return <p>{norwegian ? randomElement.norsk || randomElement.name : randomElement.name}</p>
} 