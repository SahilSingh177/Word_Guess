import { useState, useEffect } from 'react'
import { useCountdownTimer } from 'use-countdown-timer'
import { letters, countries, animals, names } from '../utils/data'
import Pusher from "pusher-js";

const Container = () => {
	const { countdown, reset, start } = useCountdownTimer({
		timer: 1000 * 40,
		autostart: false,
	})
	const [gameOver, setGameOver] = useState(false)
	const [score, setScore] = useState(0)
	const [finalScore, setFinalScore] = useState(0)
	const [bingoLetter, setBingoLetter] = useState(
		letters[Math.floor(Math.random() * letters.length)].toUpperCase()
	)

	const [country, setCountry] = useState('')
	const [name, setName] = useState('')
	const [animal, setAnimal] = useState('')

	const countriesUpper = countries.map((element) => {
		return element.toUpperCase()
	})
	const namesUpper = names.map((element) => {
		return element.toUpperCase()
	})
	const animalsUpper = animals.map((element) => {
		return element.toUpperCase()
	})

	const isTimeUp = () => {
		if (countdown === 0) {
			return true
		}
		return false
	}

	const clearFields = () => {
		setCountry('')
		setName('')
		setAnimal('')
	}

	const validateCountry = (country) => {
		if (country.substring(0, 1).toUpperCase() === bingoLetter) {
			if (countriesUpper.includes(country.toUpperCase())) {
				// setScore((score) => score + 10)
				return true
			}
		}
		return false
	}
	const validateName = (name) => {
		if (name.substring(0, 1).toUpperCase() === bingoLetter) {
			if (namesUpper.includes(name.toUpperCase())) {
				// setScore((score) => score + 10)
				return true
			}
		}
		return false
	}
	const validateAnimal = (animal)=> {
		if (animal.substring(0, 1).toUpperCase() === bingoLetter) {
			if (animalsUpper.includes(animal.toUpperCase())) {
				// setScore((score) => score + 10)
				return true
			}
		}
		return false
	}

	useEffect(() => {
		if (isTimeUp()) {
			setGameOver(true)
			setFinalScore(score)
			setScore(0)
		}
	}, [countdown])

	const generateLetter = ()=> {
		setBingoLetter(
			letters[Math.floor(Math.random() * letters.length)].toUpperCase()
		)
	}

	const startGame = () => {
		setGameOver(false)
		generateLetter()
		setScore(0)
		reset()
		start()
	}

	const bingo = () => {
		reset()
		if (country === '' || name === '' || animal === '') {
			alert('Please fill all fields')
			return
		} else {
			if (
				validateCountry(country) &&
				validateName(name) &&
				validateAnimal(animal)
			) {
				setScore((score) => score + 30)

				clearFields()
				generateLetter()
				start()
			} else if (
				!validateCountry(country) &&
				validateName(name) &&
				validateAnimal(animal)
			) {
				setScore((score) => score + 20)

				clearFields()
				generateLetter()
				start()
			} else if (
				validateCountry(country) &&
				!validateName(name) &&
				validateAnimal(animal)
			) {
				setScore((score) => score + 20)

				clearFields()
				generateLetter()
				start()
			} else if (
				validateCountry(country) &&
				validateName(name) &&
				!validateAnimal(animal)
			) {
				setScore((score) => score + 20)

				clearFields()
				generateLetter()
				start()
			} else if (
				!validateCountry(country) &&
				!validateName(name) &&
				validateAnimal(animal)
			) {
				setScore((score) => score + 10)

				clearFields()
				generateLetter()
				start()
			} else if (
				!validateCountry(country) &&
				validateName(name) &&
				!validateAnimal(animal)
			) {
				setScore((score) => score + 10)

				clearFields()
				generateLetter()
				start()
			} else if (
				validateCountry(country) &&
				!validateName(name) &&
				!validateAnimal(animal)
			) {
				setScore((score) => score + 10)

				clearFields()
				generateLetter()
				start()
			}else {
				setGameOver(true)
				clearFields()
				setFinalScore(score)
			}
		}
	}

	const [userCount, setUserCount] = useState(0);
    const initial = async () => {
		const pusher = new Pusher(process.env.REACT_APP_APP_KEY, {
		  cluster: process.env.REACT_APP_CLUSTER,
		});
		const channel = pusher.subscribe("client");
		channel.bind("pusher:subscription_count", (data) => {
		  setUserCount(data.subscription_count);
		});
		};
		useEffect(() => {
		  initial();
		}, []);
	  
	return (
		<>
		 <div className='bg-[rgba(0,0,0,0.5)]  px-10 py-8  rounded-3xl drop-shadow-sm text-white' style={{translate:"149vh -20vw"}}>Total Online Players:{" "} 
        {(userCount%2)===0?userCount/2:(userCount-1)/2} </div>
		<div className='bg-[rgba(0,0,0,0.5)]  px-10 py-8 w-full max-w-5xl rounded-3xl drop-shadow-sm flex flex-col gap-8 text-white' style={{translate:"-5vw"}}>
			<div
				className={` ${
					gameOver ? 'block' : 'hidden'
				} absolute -top-[7rem] bg-gray-100 p-4 rounded-2xl text-purple-600`}
			>
				{gameOver ? (
					<h1 className=' text-center'>
						Your Final score was{' '}
						<span className='font-bold'>{finalScore}</span>{' '}
					</h1>
				) : (
					''
				)}
			</div>
			<div className='flex justify-between '>
				<p className='font-bold '>
					Timer:{' '}
					<span
						className={`${
							countdown <= 10000
								? 'text-red-500 animate-pulse'
								: ''
						}`}
					>
						{countdown / 1000} sec
					</span>
				</p>
				<p className='font-bold'>
					Score: <span> {score}</span>
				</p>
			</div>
			<div className='flex flex-col w-full justify-center items-center'>
				<p className=''>Guess the word from letter</p>
				<h1 className='text-7xl font-bold'>{bingoLetter}</h1>
			</div>
			<div className='flex flex-col lg:flex-row items-center justify-evenly gap-4'>
				<input
					type='text'
					value={country}
					onChange={(e) => {
						setCountry(e.target.value)
						start()
					}}
					placeholder='Country'
					className='outline-none bg-transparent border-b-2 border-purple-600 w-full placeholder:text-gray-300'
				/>
				<input
					type='text'
					value={name}
					onChange={(e) => {
						setName(e.target.value)
						start()
					}}
					placeholder='Name'
					className='outline-none bg-transparent border-b-2 border-purple-600 w-full placeholder:text-gray-300'
				/>
				<input
					type='text'
					value={animal}
					onChange={(e) => {
						setAnimal(e.target.value)
						start()
					}}
					placeholder='Animal'
					className='outline-none bg-transparent border-b-2 border-purple-600 w-full placeholder:text-gray-300'
				/>
			</div>
			<div className='flex gap-2 items-center justify-center'>
				{!gameOver ? (
					<button
						className='bg-gradient-to-br from-purple-600 to-pink-600 inline-block w-max px-6 py-3 rounded-2xl text-white mx-auto'
						onClick={bingo}
						disabled={gameOver}
					>
						Bingo!
					</button>
				) : (
					<button
						className='bg-gradient-to-r from-purple-600 to-pink-600 inline-block w-max px-6 py-3 rounded-2xl text-white mx-auto'
						onClick={startGame}
					>
						Start
					</button>
				)}
			</div>
			</div>
			</>
	)
}

export default Container
