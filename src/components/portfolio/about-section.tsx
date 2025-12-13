import { calculateYearsOfExperience } from "@/lib/utils";

export function AboutSection() {
  const yearsOfExperience = calculateYearsOfExperience(new Date("2019-02-01"));
  return (
    <section id="about" className="min-h-screen flex items-center px-8 py-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-sm text-emerald-400">02.</span>
            <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
          </div>

          <div className="space-y-6 text-gray-200 leading-relaxed">
            <p>
              I'm a passionate full-stack engineer who loves turning complex
              problems into elegant solutions. My journey began in Nepal and led
              me to Halifax, where I earned my Master's in Applied Computer
              Science.
            </p>

            <p>
              I specialize in building exceptional digital experiences with a
              focus on performance and user experience. Whether it's migrating
              legacy systems or building from scratch, I bring both technical
              expertise and creative problem-solving to every project.
            </p>

            <p>
              When I'm not coding, you'll find me on a trek to the himalayas,
              taking photos with my camera, or enjoying a good cup of ginger tea
              with friends and family.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">Education</h3>
              <p className="text-sm text-gray-300">Master's in Applied CS</p>
              <p className="text-sm text-gray-300">Dalhousie University</p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-semibold mb-2">
                Experience
              </h3>
              <p className="text-sm text-gray-300">
                {yearsOfExperience}+ Years
              </p>
              <p className="text-sm text-gray-300">Full-Stack Development</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              "TypeScript",
              "React.js",
              "Next.js",
              "Astro.js",
              "Vue.js",
              "Tailwind CSS",
              "Ruby on Rails",
              "Node.js",
              "PostgreSQL",
            ].map((skill) => (
              <div
                key={skill}
                className="bg-gray-800 border border-gray-700 p-3 text-center hover:border-emerald-400 transition-colors duration-300 hover:scale-105 transform"
              >
                <span className="text-sm font-mono">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
