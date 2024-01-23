import Image from "next/image";

const Home = () => {
  return (
    <section className="h-screen flex flex-col justify-between items-center">
      <div className="hero h-fit flex flex-col items-center">

      <Image 
        src="/assets/images/logo-white.png"
        alt="blader logo"
        width={150}
        height={150}
      />
        <h1 className="overflow-hidden text-4xl text-secondary_light">Welcome to <span className="text-primary_light font-bold">blader</span>.</h1>
        <p className="text-secondary_light text-xl">The ultimate typing speed tester.</p>
      </div>

    </section>
  )
}

export default Home
