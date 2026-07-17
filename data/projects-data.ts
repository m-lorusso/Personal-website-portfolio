export interface Project {
  id: number
  title: string
  description: string
  /** Short copy for the homepage project card (falls back to description) */
  cardDescription?: string
  /** One-line outcome shown on the homepage card */
  outcome?: string
  longDescription: string
  image: string
  beforeImage?: string
  exteriorGallery?: string[]
  interiorGallery?: string[]
  finishedProductGallery?: string[]
  miscellaneousGallery?: string[]
  hardwareGallery?: string[]
  /** Not yet rendered — micromouse code shots and Rubik's UI screenshots */
  softwareGallery?: string[]
  gallery?: string[]
  videoGallery?: Array<{
    id: string
    title: string
    description: string
    isShort: boolean
  }>
  storySteps?: Array<{
    title: string
    description: string
    image: string
    highlight?: string
    aspectRatio?: string
  }>
  tags: string[]
  liveUrl: string | null
  githubUrl: string | null
  features: string[]
  technologies: Record<string, string[]>
  challenges: string
  results?: string
  learnings?: string[]
  course?: string
  imagePosition?: string
  /** Excluded from the sitemap and not statically generated (page 404s) until content is ready */
  hidden?: boolean
  /** Renders as a self-contained full-page design — the global navbar hides itself on this project's route */
  fullPage?: boolean
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Residential Construction & Renovation",
    description:
      "Full residential build completed alongside engineering degree. Structural framing, roofing, plumbing, and electrical from foundation to finish. Managing real deadlines, tradespeople, and physical work while keeping up with coursework built resilience no classroom could.",
    cardDescription:
      "Full residential build completed alongside my degree: framing, roofing, plumbing, and electrical from foundation to finish.",
    outcome: "Complete house delivered while studying full-time",
    longDescription: `
Full residential build completed alongside engineering degree. Structural framing, roofing, plumbing, electrical from foundation to finish.

The project required managing real deadlines, coordinating tradespeople, and balancing physical work with coursework. This built a level of resilience no classroom could provide.

Every step was completed with attention to building codes and quality standards.
`,
    image: "/images/construction/after.jpg",
    beforeImage: "/images/construction/before.png",
    exteriorGallery: [
      "/images/construction/before-old.jpg",
      "/images/construction/exterior-2.jpg",
      "/images/construction/exterior-4.jpg",
      "/images/construction/exterior-1.jpg",
      "/images/construction/exterior-3.jpg",
      "/images/construction/exterior-5.jpg",
      "/images/construction/primed.jpg",
      "/images/construction/after.jpg",
    ],
    interiorGallery: [
      "/images/construction/interior-3.jpg",
      "/images/construction/interior-5.jpg",
      "/images/construction/interior-2.jpg",
      "/images/construction/interior-4.jpg",
      "/images/construction/interior-1.jpg",
      "/images/construction/interior-7.jpg",
      "/images/construction/interior-6.jpg",
      "/images/construction/interior-8.jpg",
    ],
    finishedProductGallery: [
      "/images/construction/finished-1.jpg",
      "/images/construction/finished-2.jpg",
      "/images/construction/finished-3.jpg",
      "/images/construction/finished-4.jpg",
      "/images/construction/finished-5.jpg",
      "/images/construction/finished-6.jpg",
      "/images/construction/finished-7.jpg",
    ],
    miscellaneousGallery: [
      "/images/construction/misc-1.jpg",
      "/images/construction/misc-2.jpg",
      "/images/construction/misc-3.jpg",
      "/images/construction/misc-4.jpg",
      "/images/construction/misc-5.jpg",
      "/images/construction/misc-6.jpg",
      "/images/construction/misc-7.jpg",
      "/images/construction/misc-8.jpg",
      "/images/construction/misc-9.jpg",
      "/images/construction/misc-10.jpg",
      "/images/construction/misc-11.jpg",
      "/images/construction/misc-12.jpg",
      "/images/construction/misc-13.jpg",
      "/images/construction/misc-14.jpg",
      "/images/construction/misc-15.jpg",
      "/images/construction/misc-17.jpg",
      "/images/construction/misc-18.jpg",
      "/images/construction/misc-19.jpg",
    ],
    tags: ["Construction", "Renovation", "Project Management", "Building Codes"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Complete structural assessment and planning",
      "Foundation and framing construction using timber frame techniques",
      "Roof installation with proper weatherproofing and insulation",
      "Electrical system installation and compliance with safety standards",
      "Plumbing installation including water supply and drainage systems",
      "Exterior cladding and weatherproofing application",
      "Interior insulation and drywall installation",
      "Modern kitchen and bathroom installations",
      "Recessed lighting and electrical finishing",
      "Luxury vinyl plank flooring installation",
      "Window and door installation with proper sealing",
      "Interior and exterior painting and finishing",
      "Project coordination and timeline management",
      "Compliance with local building codes and regulations",
    ],
    technologies: {
      construction: [
        "Timber Frame Construction",
        "Concrete Foundation Work",
        "Steel Roofing Systems",
        "Electrical Wiring & Lighting",
        "Plumbing Systems",
        "Insulation Installation",
      ],
      tools: ["Power Tools", "Hand Tools", "Measuring Equipment", "Safety Equipment", "Scaffolding", "Ladders"],
      compliance: ["Building Codes", "Safety Regulations", "Quality Standards", "Project Management"],
    },
    challenges: `
  One of the main challenges was working with the existing foundation while ensuring the new structure met current building standards. This required careful assessment of the existing structure and strategic reinforcement where necessary.

  The interior renovation presented unique challenges with coordinating electrical, plumbing, and HVAC systems within the existing structure. Proper sequencing of trades was critical to ensure quality workmanship and avoid conflicts between different systems.

  Weather conditions also posed challenges during the construction phase, requiring flexible scheduling and proper protection of materials and work areas. Coordinating multiple trades and ensuring quality workmanship while maintaining project timelines required strong organizational and communication skills.

  Ensuring compliance with all building codes and regulations while maintaining cost-effectiveness was another key challenge that required thorough planning and attention to detail throughout the construction process.
`,
  },
  {
    id: 2,
    title: "Micromouse Maze Navigation Robot",
    description:
      "Autonomous maze-solving robot built from scratch. Integrated LiDAR, IMU, and wheel encoders with path planning algorithm for real-time decision making. Top-3 competition finish.",
    cardDescription:
      "Autonomous maze-solving robot combining LiDAR, IMU, and wheel encoders with BFS path planning and PID control.",
    outcome: "Top-3 finish: solved the maze in under 90 seconds",
    longDescription: `
Autonomous maze-solving robot built from scratch. Integrated LiDAR, IMU, and wheel encoders with path planning algorithm for real-time decision making.

The robot achieved a top-3 competition finish by efficiently mapping the maze environment and planning optimal paths through it.

Sensor fusion combined data from multiple sources to maintain accurate position estimates and make real-time navigation decisions.
`,
    image: "/images/micromouse/robot.jpg",
    hardwareGallery: [
      "/images/micromouse/robot.jpg",
      "/images/micromouse/prototype.jpg",
      "/images/micromouse/workshop.jpg",
      "/images/micromouse/assembled.jpg",
      "/images/micromouse/closeup.jpg",
      "/images/micromouse/testing-lab.jpg",
    ],
    softwareGallery: [
      "/images/micromouse/code-1.jpg",
      "/images/micromouse/code-2.jpg",
      "/images/micromouse/algorithm.jpg",
    ],
    videoGallery: [
      {
        id: "EOZJjVUmMxs",
        title: "Micromouse Maze Navigation",
        description:
          "Full demonstration of the Micromouse robot navigating through a complex maze environment using its sensor array and path planning algorithms.",
        isShort: false,
      },
      {
        id: "ZRjj2WblTCQ",
        title: "Early Testing - Accuracy Focus",
        description:
          "This video shows early testing of the micromouse robot where we prioritized getting accurate movement over speed. The robot demonstrates precise navigation and turning capabilities.",
        isShort: false,
      },
      {
        id: "B2lfw8Rdm6E",
        title: "PID Control Straight Line Demonstration",
        description:
          "This video demonstrates the PID controller in action alongside aid from LiDAR values, showing how the robot maintains a straight line path with precise motor control.",
        isShort: true,
      },
    ],
    tags: ["C/C++", "LiDAR", "IMU", "Path Planning", "Embedded Systems"],
    liveUrl: null,
    githubUrl: "https://github.com/z5360700/micromouse-from2024",
    features: [
      "Autonomous maze navigation using sensor fusion",
      "Real-time occupancy map generation with computer vision",
      "Path planning with Breadth-First Search algorithm",
      "PID control for precise movement and turning",
      "Manual override with user-defined input sequences",
      "Obstacle detection and avoidance",
      "Real-time data processing on Arduino Nano",
    ],
    technologies: {
      hardware: [
        "Arduino Nano microcontroller",
        "LiDAR sensor for distance measurement",
        "IMU (Inertial Measurement Unit)",
        "Wheel encoders for odometry",
        "DC motors with motor drivers",
        "Custom PCB for component integration",
      ],
      software: [
        "C++ for embedded systems programming",
        "Python for high-level control and vision processing",
        "OpenCV for image processing and map generation",
        "PID control algorithms",
        "Breadth-First Search for path planning",
        "Serial communication protocols",
      ],
      tools: [
        "Arduino IDE",
        "Python development environment",
        "Git for version control",
        "CAD software for mechanical design",
        "Oscilloscope and multimeter for debugging",
      ],
    },
    challenges: `
  One of the primary challenges was achieving accurate localization within the maze environment. Small errors in sensor readings or wheel slippage could compound over time, leading to significant position estimation errors. We addressed this by implementing sensor fusion techniques that combined data from multiple sources to improve accuracy.

  Processing constraints were another significant challenge, as the Arduino Nano has limited computational resources. Optimizing the code for efficiency while maintaining real-time performance required careful algorithm selection and implementation.

  The integration of computer vision for map generation presented challenges in terms of processing speed and accuracy. We had to balance the resolution of the occupancy map with the processing capabilities of our system to ensure real-time performance.

  Tuning the PID controllers for consistent performance across different maze surfaces and conditions required extensive testing and parameter adjustment. We developed an adaptive control system that could adjust parameters based on detected surface conditions.
`,
  },
  {
    id: 3,
    title: "Custom Cooling Funnels for PC Hardware",
    description:
      "Designed and 3D-printed ducted airflow funnels for GPU cooling, inspired by automotive cooling systems. Achieved 7°C reduction in GPU temperatures under load.",
    cardDescription:
      "Ducted airflow funnels designed in Fusion 360 and 3D-printed across three iterations to feed intake air straight to the GPU.",
    outcome: "7°C cooler under full load",
    longDescription: `Designed and 3D-printed ducted airflow funnels for GPU cooling, inspired by automotive cooling systems. Achieved measurable 7°C reduction in GPU temperatures under load.

The solution identified that airflow in PC cases isn't optimized - intake air disperses inside rather than reaching the GPU directly.

Custom ducting directs cool air from front intake fans straight to the GPU, allowing it to maintain higher boost clocks for longer periods under demanding tasks.
`,
    image: "/images/cooling/installed.jpg",
    storySteps: [
      {
        title: "The Problem",
        description:
          "I noticed that airflow in PC cases isn't optimized. Front intake fans push air in, but much of it disperses inside the case rather than reaching the GPU directly.",
        image: "/images/cooling/airflow-problem.jpg",
        highlight:
          "Green arrows show air coming in, red arrows show where it exits - but the path in between isn't direct",
        aspectRatio: "aspect-[4/3]",
      },
      {
        title: "The Inspiration",
        description:
          "I drew inspiration from automotive cooling systems, where ducted parts channel air directly to engine components that need cooling the most.",
        image: "/images/cooling/rs3-intake.jpg",
        highlight:
          "This is an RS3 carbon fiber air intake - in high-performance cars, every bit of airflow is carefully directed where it's needed most.",
        aspectRatio: "aspect-video",
      },
      {
        title: "Modeling the Case",
        description:
          "Rather than model the entire PC case from scratch, I downloaded an existing 3D model of it online and brought it into Fusion360 as the reference for the duct.",
        image: "/images/cooling/case-model.png",
        highlight: "",
        aspectRatio: "aspect-video",
      },
      {
        title: "Adding Components",
        description:
          "Next, I modeled the GPU and intake fan positions to understand the exact path the air needed to travel.",
        image: "/images/cooling/case-with-gpu.png",
        highlight: "",
        aspectRatio: "aspect-video",
      },
      {
        title: "Designing the Duct",
        description:
          "I designed a custom cooling funnel that would direct air from the front intake fans straight to the GPU's cooling system.",
        image: "/images/cooling/duct-design.png",
        highlight: "The duct features a gradually narrowing design to accelerate airflow as it approaches the GPU.",
        aspectRatio: "aspect-[3/2]",
      },
      {
        title: "Finalizing Components",
        description:
          "The final design included multiple components that would fit together perfectly while being printable on a standard 3D printer bed.",
        image: "/images/cooling/duct-component.png",
        highlight: "",
        aspectRatio: "aspect-[3/2]",
      },
      {
        title: "Slicing for Printing",
        description:
          "Using Bambu Studio, I prepared the 3D models for printing, setting up supports and optimizing print settings for PLA material.",
        image: "/images/cooling/slicing.png",
        highlight: "The green areas show support structures needed for successful printing of complex geometries.",
        aspectRatio: "aspect-[4/3]",
      },
      {
        title: "Printed Components",
        description: "After several hours of printing, the cooling duct components were ready for installation.",
        image: "/images/cooling/printed-parts.jpg",
        highlight: "PLA material was chosen for its ease of printing and durability, well suited to the duct's low-stress location in the case.",
        aspectRatio: "aspect-video",
      },
    ],
    tags: ["Fusion 360", "3D Printing", "PLA", "Thermal Engineering"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Custom 3D-modeled PC case components for precise fit",
      "Automotive-inspired ducted airflow design",
      "PLA material selection for ease of printing and durability",
      "Modular design allowing easy installation and removal",
      "Direct airflow channeling from intake fans to GPU",
      "Optimized internal geometry for minimal airflow restriction",
      "Split-part design for 3D printing feasibility",
      "Temperature monitoring and performance validation",
    ],
    technologies: {
      design: [
        "Fusion360 CAD Software",
        "3D Modeling and Assembly",
        "Airflow Simulation Principles",
        "Thermal Management Design",
        "Parametric Design Techniques",
      ],
      manufacturing: [
        "Bambu Studio Slicing Software",
        "PLA Filament 3D Printing",
        "Multi-part Assembly Design",
        "Support Structure Optimization",
        "Print Quality Optimization",
      ],
      testing: [
        "Temperature Monitoring",
        "Airflow Measurement",
        "Performance Benchmarking",
        "Thermal Imaging Analysis",
        "System Stability Testing",
      ],
    },
    challenges: `
  One of the primary challenges was accurately measuring and modeling the internal dimensions of the PC case while accounting for cable management and component clearances. The ducting needed to fit precisely without interfering with other components or restricting access for maintenance.

  Designing for 3D printing presented constraints in terms of overhang angles, support material requirements, and print bed size limitations. The duct had to be split into multiple parts that could be printed separately and assembled, while maintaining structural integrity and airflow efficiency.

  Material selection was important for this application. PLA was chosen for its ease of printing and good structural properties, making it ideal for prototyping and testing the ducting design.

  Validating the effectiveness of the cooling solution required establishing baseline temperature measurements and conducting controlled testing under various load conditions. Ensuring that the ducting actually improved cooling performance rather than just redirecting airflow was essential to the project's success.
`,
    results: `
  The custom cooling ducts proved highly effective, reducing GPU temperatures by 7°C under full load compared to the standard case configuration. This temperature reduction allowed the GPU to maintain higher boost clocks for longer periods, resulting in more consistent performance during demanding tasks like gaming and 3D rendering.

  An unexpected benefit was the reduction in fan noise, as the GPU's cooling system didn't need to work as hard to maintain safe temperatures. The direct airflow path also reduced dust accumulation on the GPU, as air was now following a more controlled path through the case.

  The project demonstrated how principles from automotive cooling systems could be successfully applied to PC hardware cooling, opening up possibilities for further optimization of other components like CPU coolers and memory modules.
`,
  },
  {
    id: 4,
    title: "UR5e Robotic Writing System",
    description: "MATLAB program using RTDE interface to command UR5e industrial robot arm to trace digits and execute mathematical operations. Implemented coordinate frame transformations with consistent positional accuracy.",
    cardDescription:
      "MATLAB program commanding a UR5e industrial arm over RTDE to write digits and solve long-form math on paper.",
    outcome: "Smooth, legible writing with repeatable positioning",
    longDescription: `MATLAB program using RTDE interface to command UR5e industrial robot arm to trace digits and execute mathematical operations.

The robot writes individual numbers, moves them around the page, and solves addition, subtraction, and multiplication problems in traditional long-form style.

Implemented coordinate frame transformations and motion trajectories with consistent positional accuracy across repeated tasks. The robot moves smoothly like a human hand, lifting the pen between strokes and positioning everything perfectly on the page.`,
    image: "/images/ur5e/main-setup.jpg",
    gallery: ["/images/ur5e/main-setup.jpg", "/images/ur5e/calculation.jpg"],
    videoGallery: [
      {
        id: "pXVlnAXTHe0",
        title: "Robot Writing Numbers",
        description: "Watch the UR5e robot write individual digits with smooth, precise movements.",
        isShort: false,
      },
      {
        id: "O-SpeSzh-Yo",
        title: "Math Problem Solving",
        description:
          "The robot solves a complete multiplication problem, showing all the steps just like you would on paper.",
        isShort: false,
      },
      {
        id: "efF5-d9ksCc",
        title: "Advanced Calculations",
        description: "More complex mathematical operations demonstrated by the robotic writing system.",
        isShort: false,
      },
    ],
    tags: ["MATLAB", "RTDE", "UR5e", "Robotics", "Coordinate Transforms"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Writes individual numbers and math symbols",
      "Solves addition, subtraction, and multiplication problems",
      "Moves text around the page to any position",
      "Smooth, human-like writing motion",
      "Automatic pen lifting between strokes",
      "Perfect spacing and alignment",
    ],
    technologies: {
      software: ["MATLAB Programming", "Robot Control Algorithms", "Motion Planning"],
      hardware: ["UR5e Collaborative Robot", "Writing Tool Attachment", "Grid Paper Workspace"],
    },
    challenges: `The biggest challenge was making the robot write smoothly like a human. I had to program it to know when to lift the pen, how fast to move, and where to position each part of the math problem.

Getting the spacing right was tricky too - the robot needed to know exactly where to put each number so the final answer would line up correctly, just like when you do long division or multiplication by hand.`,
    learnings: [
      "Robot programming and control",
      "Motion planning for smooth movement",
      "Coordinate systems and positioning",
      "MATLAB programming skills",
    ],
  },
  {
    id: 5,
    title: "Cat Door Monitoring System",
    description:
      "ESP32 break-beam monitor for a pet door. Detects movement, filters false triggers, and sends timestamped Telegram alerts.",
    cardDescription:
      "ESP32 break-beam monitor for a pet door that debounces false triggers and sends timestamped Telegram alerts.",
    outcome: "Detected an intruder cat within 2 days of deployment",
    longDescription: `
ESP32 break-beam monitor for a pet door. V1 used PIR sensing, but false-triggered on insects and nearby door movement.

V2 switched to a beam across the opening, debounced events in firmware, and sent timestamped Telegram alerts. Within 2 days of deployment, it detected an intruder cat attempting to enter.
`,
    image: "/images/cat-door/v2-system.jpg",
    videoGallery: [
      {
        id: "4Ufpr4eA3jw",
        title: "Cat Door Monitoring System V2 Demonstration",
        description:
          "Demonstration of the Version 2 cat door monitoring system using break beam sensors, ESP32, and Telegram notifications.",
        isShort: false,
      },
    ],
    tags: ["ESP32", "IoT", "Embedded C", "Telegram API", "Sensors"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Evolution from PIR sensors (V1) to break beam sensors (V2) for improved reliability",
      "ESP32 WiFi connectivity for real-time communication",
      "Telegram bot integration for instant mobile notifications",
      "Custom 3D printed weatherproof housing designed in Fusion360",
      "LED status indicators for visual feedback",
      "Sensor debouncing to prevent false triggers",
      "Low power consumption for continuous operation",
      "Immediate detection and notification of unauthorized access",
      "Timestamped activity logs for behavior analysis",
      "Modular design for easy maintenance and upgrades",
    ],
    technologies: {
      hardware: [
        "ESP32 Development Board",
        "Break Beam Sensors (Transmitter & Receiver)",
        "LED Status Indicators",
        "3D Printed PLA Housing",
        "Breadboard Prototyping",
        "Weatherproof Connectors",
      ],
      software: [
        "Arduino IDE for ESP32 programming",
        "WiFi Libraries for network connectivity",
        "Telegram Bot API integration",
        "Sensor debouncing algorithms",
        "HTTP/HTTPS communication protocols",
      ],
      design: [
        "Fusion360 for CAD modeling",
        "Bambu Studio for 3D print slicing",
        "PLA filament for housing",
        "Iterative prototyping approach",
      ],
    },
    challenges: `
  The first major challenge was sensor selection. The initial PIR sensor design (V1) proved unreliable, triggering on small insects and even when opening the nearby door. This led to the redesign using break beam sensors, which provided much more accurate and reliable detection.

  Designing a weatherproof housing that could accommodate the electronics while remaining compact and unobtrusive required several iterations. The final design needed to protect the ESP32 and sensors from moisture while allowing easy access for maintenance and battery replacement.

  Ensuring reliable WiFi connectivity in the installation location was another challenge, as the cat door is located in an area with potentially weak signal strength. Implementing proper error handling and reconnection logic was essential for consistent notification delivery.

  Tuning the sensor debouncing to distinguish between actual cat passages and false triggers (wind, debris) required extensive real-world testing and parameter adjustment.
`,
    results: `
  The system proved immediately effective - within the first 2 days of deployment, it detected and alerted me to the intruder cat attempting to enter the house, allowing me to catch and remove him from the property.

  The break beam sensor implementation in V2 eliminated the false positive issues experienced with the PIR sensor in V1, providing reliable detection with no missed events or false alarms during normal operation.

  The Telegram notification system provides instant alerts with timestamps, enabling quick response to any cat door activity and building a log of movement patterns for behavior analysis.
`,
  },
  {
    id: 6,
    title: "Custom Watch Build",
    description:
      "Sourced and hand-assembled individual components around Seiko NH35 movement. Precision assembly requiring dust-free environment, component compatibility verification, and steady hands for hand-setting.",
    cardDescription:
      "Mechanical watch hand-assembled from individually sourced components around a Seiko NH35 movement.",
    outcome: "Runs within NH35 spec: clean, dust-free build",
    longDescription: `Sourced individual watch components - case, dial, hands, crystal, crown, bracelet - and assembled them into a complete mechanical watch by hand, built around a Seiko NH35 movement.

The challenge was not manufacturing, but precision assembly. Fitting a movement into a case, aligning the dial perfectly, pressing on hands without damaging them, seating the crystal, and keeping everything dust-free required patience and precision at a scale where any misalignment is immediately visible.

Sourcing compatible parts was its own challenge - not all cases and hands marketed for the NH35 are compatible. Verifying dimensions and fitment required careful research before committing to assembly.`,
    image: "/images/watch/cover.png",
    fullPage: true,
    videoGallery: [
      {
        id: "nR-1D8_llwg",
        title: "Custom Watch Build Process",
        description:
          "A detailed look at the custom watch build process, showcasing the precision and patience required at every step of assembly.",
        isShort: false,
      },
    ],
    imagePosition: "top",
    tags: ["Horology", "Precision Assembly", "Mechanical Engineering", "Component Sourcing"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "Full watch assembly from individually sourced components",
      "Built around a Seiko NH35 automatic movement",
      "Hand pressing of dial, hands, crystal, and case back",
      "Component compatibility research and verification across suppliers",
      "Dust-free assembly environment and clean handling practices",
      "Final accuracy testing and quality checks",
    ],
    technologies: {
      skills: [
        "Precision Hand Assembly",
        "Component Sourcing & Compatibility Research",
        "Patience & Persistence",
        "Careful Planning & Sequencing",
        "Fine Motor Control",
        "Attention to Detail",
      ],
      tools: [
        "Watchmaking Screwdrivers",
        "Tweezers & Hand-Setting Tools",
        "Magnification Loupes",
        "Dust Blower & Rodico Cleaning Putty",
        "Crystal & Case Back Press",
        "Movement Holder & Cushion",
      ],
    },
    challenges: `The biggest challenge was the patience required. Working with components this small, a moment of rushing or frustration can mean a scratched dial, a bent hand, or dust trapped under the crystal - all of which mean taking everything apart and starting over.

Sourcing compatible parts was also tricky. Not all cases, dials, and hands marketed for the NH35 are actually compatible. Stem lengths, dial feet positions, chapter ring fitment, and hand hole sizes all had to be verified before committing to an assembly order.

Pressing on the hands was the most nerve-wracking step. Too much force damages the dial or the hand itself. Too little and the hand slips. Getting the hour, minute, and second hands seated correctly without any of them fouling against each other required a steady hand and a lot of concentration.`,
    results: `The finished watch runs reliably on the wrist with accuracy within the NH35 specification, and all components fit together cleanly with no dust, misalignment, or mechanical issues.

More importantly, this project reinforced the value of patience and careful planning - the same mindset that drives quality in every other project on this portfolio. Rushing never pays off when the tolerances are this tight, and that lesson applies equally to soldering, 3D printing, coding, and construction.`,
  },
  {
    id: 7,
    title: "5-Motor Robotic Rubik's Cube Solver",
    description:
      "Solo-built electromechanical rig that solves any scrambled 3×3 end-to-end. ESP32 drives 5× NEMA 17 steppers through TMC2209 drivers, fed by a Kociemba two-phase solver and a browser-based colour-input UI.",
    cardDescription:
      "Solo-built rig where an ESP32 drives five stepper motors, fed by a Kociemba solver and a browser-based colour-input UI.",
    outcome: "Solves any scramble: ~20-move plan computed in under 1 second",
    longDescription: `Solo-built electromechanical system that solves any valid scrambled 3×3 Rubik's cube end-to-end. Once the cube state is entered through the web UI, the full pipeline (solve computation, move translation, physical actuation) runs without human intervention.

An ESP32 DevKitC drives 5× NEMA 17 steppers (R, L, F, B, D faces) through TMC2209 V2.0 drivers on a 12V 8A supply. The cube is loaded through slidable, removable L-brackets on the open top. With no top-face motor, U-face moves are reproduced in firmware via a 13-move equivalence using the surrounding faces. That trade trims mechanical complexity in exchange for a longer move list.

The solver is the Kociemba two-phase algorithm, the same class of solver used in record-setting cube robots and the algorithmic basis for the proof that any cube state is solvable in 20 moves or fewer. A Python implementation runs on localhost, computes a near-optimal solution of roughly 20 moves in under 1 second, then streams the expanded physical move sequence to the firmware over Serial.

V1 deliberately defers computer-vision colour detection and a 6th U-face motor in favour of an open-top, manual-input design that prioritises mechanical simplicity, cube accessibility, and reliable end-to-end solving.`,
    image: "/images/rubiks/cube-front.jpg",
    hardwareGallery: [
      "/images/rubiks/final-design.jpg",
      "/images/rubiks/motor-diagram.jpg",
      "/images/rubiks/motor-design.jpg",
      "/images/rubiks/motor-design-final.jpg",
      "/images/rubiks/breadboard-wiring.jpg",
      "/images/rubiks/motor-design-2.jpg",
      "/images/rubiks/motor-with-adapter.jpg",
      "/images/rubiks/single-motor-bracket.jpg",
    ],
    softwareGallery: [
      "/images/rubiks/ui-empty.png",
      "/images/rubiks/ui-filled.png",
      "/images/rubiks/ui-solved.png",
    ],
    videoGallery: [
      {
        id: "OC9h20jK2XQ",
        title: "Cube Solver in Action",
        description: "End-to-end demonstration: cube state entered through the web UI, solver runs locally, and the rig executes the move sequence on a scrambled cube.",
        isShort: false,
      },
    ],
    tags: ["ESP32", "C++/Arduino", "Python", "Kociemba", "TMC2209", "Fusion 360", "3D Printing"],
    liveUrl: null,
    githubUrl: null,
    features: [
      "5-motor open-top architecture (R, L, F, B, D): slidable L-brackets allow cube swap without disassembly",
      "U-face moves synthesised in firmware via a 13-move equivalence (U = R L F2 B2 R' L' D L' R' B2 F2 L R)",
      "Kociemba two-phase solver running locally in Python: ~20-move near-optimal solves in under 1 second",
      "Browser-based colour-palette input with real-time state validation and solve timing",
      "Move map handles both Kociemba numeric (B1, B3, R2) and prime notation: no moves silently dropped",
      "TMC2209 V2.0 drivers on a 12V 8A supply for quiet, micro-stepped face rotations",
      "Custom 3D printed chassis, motor mounts, baseplate, and cube couplers (Fusion 360 / Bambu Studio / PLA+)",
      "Arduino/AccelStepper firmware accepting space-separated move sequences from any host",
    ],
    technologies: {
      firmware: [
        "ESP32 DevKitC",
        "C++ / Arduino",
        "AccelStepper library",
        "TMC2209 V2.0 stepper drivers",
        "Serial command protocol",
      ],
      solver: [
        "Python",
        "Kociemba two-phase algorithm",
        "Localhost Python service",
        "Numeric + prime move notation",
      ],
      frontend: [
        "HTML / JavaScript",
        "Colour-palette cube input",
        "Real-time state validation",
        "Solve timing + move list display",
      ],
      mechanical: [
        "5× NEMA 17 stepper motors",
        "Fusion 360 CAD",
        "Bambu Studio slicing",
        "PLA+ filament",
        "12V 8A bench supply",
      ],
    },
    challenges: `The U-face is the hardest part of any Rubik's cube robot: there is nothing for a motor to grip on the top. Adding a 6th motor and arm would have meant a closed-top chassis and a cube that has to be loaded through a side hatch. Instead, V1 leaves the top open and synthesises U with a 13-move sequence on the surrounding faces. The solve is longer, but the rig stays mechanically simple and the cube can be inserted or swapped in seconds through removable L-brackets.

Sourcing compatible parts and getting consistent torque without skipped steps required tuning the TMC2209 current limits and AccelStepper acceleration curves carefully. A face that under-rotates by a few degrees throws off every subsequent move, so calibration of the per-motor zero positions and step-per-quarter-turn ratios was iterative.

The colour-input UI also had to be defensive: Kociemba rejects any invalid cube state outright, so the frontend validates colour counts and centre-piece consistency before sending the state, otherwise a user could spend a minute typing in a state that the solver will refuse a second later.`,
    results: `End-to-end pipeline works on arbitrary valid scrambles: state is typed into the browser, solved locally in Python, and pushed to the ESP32 over Serial. Kociemba computes a near-optimal solution of roughly 20 moves in under 1 second, then the 5-axis configuration expands it to roughly 55 physical motor commands.

The open-top, manual-input design has been a clear win for V1: it keeps the mechanical envelope small, makes cube changes trivial, and lets the focus stay on solver correctness and motor control rather than on a vision pipeline. Computer-vision colour detection and a 6th U-face motor are the obvious next steps for V2.`,
    learnings: [
      "Mechanical scope discipline: choosing a 5-motor open-top design and synthesising U in firmware",
      "Embedded motor control with TMC2209 drivers and AccelStepper",
      "Integrating a Python solver with embedded firmware over Serial",
      "Building a defensive web UI for state input where downstream tools are strict",
      "Trade-offs between move-count efficiency and mechanical complexity",
    ],
  },
  {
    id: 8,
    hidden: true,
    title: "PVT Calculator Tool",
    description:
      "Thesis project: a PVT calculator tool, built in collaboration with CoolSheet.",
    longDescription: `Thesis project, built in collaboration with CoolSheet. A browser-based PVT calculator tool.`,
    image: "/placeholder.svg",
    tags: [],
    liveUrl: "https://m-lorusso.github.io/PVT-calculator-tool/",
    githubUrl: "https://github.com/m-lorusso/PVT-calculator-tool",
    features: [],
    technologies: {},
    challenges: "",
  },
]
