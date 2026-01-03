export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  category: "misc" | "web3" | "portfolio";
}

export const miscProjects: Project[] = [
  {
    id: "fallen-prototype",
    title: "FALLEN+ Prototype",
    description: "Futuristic Shop built using HTML, CSS and Javascript",
    link: "https://fallenprototype1.netlify.app/",
    image: "./images/FALLEN/FALLEN_image_1.jpg",
    category: "misc",
  },
  {
    id: "fallen-android",
    title: "FALLEN+ Android Application",
    description: "Android Version of the FALLEN+ Website",
    link: "https://github.com/RelegatedLeader/fallen_app_android",
    image: "./images/falllen_logo_`.jpg",
    category: "misc",
  },
  {
    id: "underwater-cuisine",
    title: "Underwater Cuisine Website",
    description:
      "A basic aesthetic website that looks into the world of a underwater restaurant with its delicacies.",
    link: "https://underwatercuisine.netlify.app/",
    image: "./images/underwater_cuisine_picture.jpg",
    category: "misc",
  },
  {
    id: "fallestrial",
    title:
      "FALLESTRIAL - USING REACT NATIVE (Prototype - unfinished) MOBILE VERSION",
    description:
      "A secure and visionary social media platform where limitless creativity meets unwavering privacy, redefining the digital landscape for a sophisticated and inclusive experience.",
    link: "https://github.com/RelegatedLeader/fallestrial_react_native",
    image: "img/FALLESTRIAL img1.png",
    category: "misc",
  },
  {
    id: "fallen-therapeutics",
    title: "FALLEN Therapeutics Commercial",
    description:
      "A commercial that is based on the idea of an affordable therapy application.",
    link: "https://animoto.com/play/iw0bkC0d85XVOgmpj9HG6g",
    image: "images/FALLEN_therapeutics_logo.PNG",
    category: "misc",
  },
  {
    id: "flight-space",
    title: "Flight Space Services",
    description: "Orbital Mining & Space Services for the future",
    link: "https://flightspaceservices.netlify.app/",
    image: "img/flightLogo_r__imgupscaler.ai_General_4K.jpg",
    category: "misc",
  },
  {
    id: "singularity",
    title: "444 Singularity Regulation",
    description:
      "SINGULARITY REGULATION SYSTEM - Protecting humanity through intelligent AI governance and robotic regulation",
    link: "https://444singularityregulation.netlify.app/",
    image: "img/robothandmakingheart_logo.jpg",
    category: "misc",
  },
  {
    id: "ieng-industries",
    title: "Ieng Industries",
    description:
      "The Future of Transportation - Experience next-generation mobility powered by advanced nuclear fusion and solar technology.",
    link: "https://ieng.onrender.com/",
    image: "img/Ieng_logo_imgupscaler.ai_General_4K.jpg",
    category: "misc",
  },
  {
    id: "free-by-ma",
    title: "FREE by Ma ™",
    description:
      "Advanced personal technology devices powered by quantum privacy to help you understand yourself, heal, grow, and make decisions that lead to your best future.",
    link: "https://freebyma.netlify.app/",
    image: "img/freebyma_1.png",
    category: "misc",
  },
  {
    id: "celestia-space",
    title: "Celestia Space",
    description:
      "Journey Beyond the Stars • Premium Space Travel at Revolutionary Prices",
    link: "https://celestiaspace.netlify.app/",
    image: "img/celestia_logo_imgupscaler.ai_General_4K.jpg",
    category: "misc",
  },
  {
    id: "natura",
    title: "Natura",
    description: "Heal Our World",
    link: "https://naturahealss.netlify.app/",
    image: "img/unblurimageai_naturaLogo_1.jpg",
    category: "misc",
  },
  {
    id: "entropia",
    title: "Entropia",
    description:
      "Revolutionary nanotechnology solutions transforming every sector of human experience. From precision medicine to sustainable living.",
    link: "https://entropiatech.netlify.app/",
    image: "img/entropia_img1_imgupscaler.ai_General_4K.jpg",
    category: "misc",
  },
  {
    id: "freefall",
    title: "FreeFall",
    description: "Gravity is Optional. Hover/flying cars.",
    link: "https://freefallfuture.netlify.app/",
    image: "img/freefall_logo1-removebg-preview.png",
    category: "misc",
  },
  {
    id: "fallflex",
    title: "FallFlex",
    description:
      "YOU GET TO DREAM - An infinite economy where robots handle repetition and humans pursue their greatest potential.",
    link: "https://fallflex.netlify.app/",
    image: "img/fallflex_logo1_imgupscaler.ai_General_4K.jpg",
    category: "misc",
  },
];

export const web3Projects: Project[] = [
  {
    id: "su-messaging",
    title: "SU Messaging",
    description: "A modern messaging platform.",
    link: "https://su-messaging.netlify.app/",
    image: "img/su-logo.png",
    category: "web3",
  },
  {
    id: "paymex",
    title: "PAYMEX",
    description: "Encrypt your funds! (Test - Using React)",
    link: "https://payme-x.netlify.app/",
    image: "images/cryptoimage1.png",
    category: "web3",
  },
  {
    id: "prometheus",
    title: "Prometheus",
    description: "Hash-based Messaging",
    link: "https://prometheusps.netlify.app/",
    image: "img/prometheus_logo.png",
    category: "web3",
  },
  {
    id: "private-key",
    title: "Private Key Login System (Alpha)",
    description:
      "Create an account using the encryption of the future! (Using React)",
    link: "https://pkk-1.netlify.app/",
    image: "images/private_key_login_logo.PNG",
    category: "web3",
  },
  {
    id: "ftech",
    title: "F-Tech",
    description:
      "A futuristic tech shop where you can connect your wallet and purchase cutting-edge digital items seamlessly",
    link: "https://ftech-commerce.netlify.app/",
    image: "img/ftechlogo_1_imgupscaler.ai_General_4K.jpg",
    category: "web3",
  },
];
