import Image from "next/image";

const Home = () => {
  return (
    <section className="h-full flex flex-col justify-between items-center">
        <h1 className="text-4xl text-secondary_light">Welcome to <span className="text-primary_light font-bold">blader</span>.</h1>
        <p className="text-secondary_light text-xl">The ultimate typing speed tester.</p>
    </section>
  )
}

export default Home
