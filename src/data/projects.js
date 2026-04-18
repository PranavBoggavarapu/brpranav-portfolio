const image = (id, width = 2288, height = 1636) =>
  `https://framerusercontent.com/images/${id}.png?width=${width}&height=${height}`;

// Add or edit portfolio projects here. The homepage and /work/:id pages update from this data.
export const projects = [
  {
    id: "edge-control",
    eyebrow: "Hair Cosmetics & Beauty",
    title: "Edge Control - Culturally-Driven Hair Cosmetics E-commerce Platform",
    client: "Edge Control",
    platform: "E-commerce Website",
    role: "UI/UX & Interaction Designer",
    objective:
      "Improve product discovery, reduce purchase hesitation, and create a brand-aligned shopping experience.",
    cover: image("z67CX0PD9QIzj5k8fy54s4A0"),
    alt: "Hair cosmetics e-commerce product grid design",
    summary:
      "Edge Control is a culturally expressive hair cosmetics brand offering modern styling products. The goal was to design an e-commerce platform that communicates brand personality while making shopping simple and confidence-driven.",
    problem:
      "Users visiting beauty e-commerce stores often struggle to decide which product suits them. Product pages usually emphasize visuals but fail to provide clear guidance, leading to hesitation before purchase.",
    users:
      "Primary users were young customers interested in hair styling and self-care products. Many were first-time buyers unfamiliar with technical product differences.",
    approach:
      "I structured the journey around discovery, understanding, trust, and purchase so each screen answered what the product is, whether it is right for the user, whether it can be trusted, and how to buy it.",
    challenges: [
      "Users unsure which product variant to choose",
      "Over-reliance on imagery without supporting explanation",
      "Lack of strong trust indicators",
      "Decision fatigue while browsing multiple products",
      "Friction in moving from browsing to checkout",
    ],
    decisions: [
      "Large product imagery to communicate brand identity",
      "Ingredient highlights to build credibility",
      "Structured product descriptions for easy scanning",
      "Consistent typography for readability",
      "Prominent Add to Cart CTA",
      "Minimal checkout steps",
    ],
    outcome:
      "The redesigned shopping experience improves purchase confidence by guiding users through product understanding rather than just product browsing.",
    learned:
      "Strong visuals alone do not create good e-commerce experiences. Users need clarity and reassurance before they make purchasing decisions.",
    gallery: [
      image("FwmSyBmZw2tt0ikMQHaqNntEM7g", 1072, 1636),
      image("E7KgapkgubKwGE0Haw5DZaMT64", 1072, 1636),
      image("xYILTCSHHxe9xRpKVUTpqZkbU"),
    ],
  },
  {
    id: "wecrews",
    eyebrow: "Automotive Assistance & Services",
    title: "Wecrews - Redefining Automotive Assistance",
    client: "Wecrews",
    platform: "Mobile Application",
    role: "Web & Mobile Application",
    objective: "Enable vehicle owners to quickly request help and track service during emergencies.",
    cover: image("vygKVaAplFwrIaNYSs5nIfW44"),
    alt: "Automotive assistance platform UX design Wecrews",
    summary:
      "Wecrews is an automotive assistance platform designed to connect vehicle owners with nearby service providers for breakdown support and maintenance help.",
    problem:
      "When vehicles break down, users do not have time to learn an interface. Existing service-request flows often require too many steps, causing delay, frustration, and uncertainty.",
    users:
      "Primary users were daily commuters and travelers who needed immediate roadside assistance. Many users were non-technical, so the interface needed to work for first-time usage without instructions.",
    approach:
      "I designed the experience around one main idea: reduce decision time. Every screen answers how to get help, whether help is coming, and when it will arrive.",
    challenges: [
      "Knowing which service to select",
      "Understanding whether help was confirmed",
      "Tracking when assistance would arrive",
      "Designing for stressful, outdoor usage",
      "Reducing uncertainty during urgent moments",
    ],
    decisions: [
      "High-visibility primary action button",
      "Large readable typography for outdoor usage",
      "Status indicators showing service progress",
      "Minimal text to reduce cognitive load",
      "Real-time feedback to build trust",
    ],
    outcome:
      "The redesigned experience allows users to request assistance quickly and track service clearly, reassuring users during stressful situations.",
    learned:
      "Emergency-service UX needs emotional reassurance as much as usability. Clear feedback can reduce stress and build trust.",
    gallery: [
      image("t4mWsI7TvBvZJqApqVKy2BGWb7Q", 1072, 1636),
      image("MYNMLXrY2w1i6X2WhCHR1mZVQo", 1072, 1636),
      image("xNVJ203XRsyZrbY6Pzszxtl5ZA"),
    ],
  },
  {
    id: "docroom",
    eyebrow: "Healthcare Technology",
    title: "Docroom - Clinical Workflow & Patient Case Management Application",
    client: "Docroom",
    platform: "Doctor-Facing Mobile Application",
    role: "UI/UX & Interaction Designer",
    objective: "Help doctors quickly access patient information and manage cases without workflow delays.",
    cover: image("7hSKQ7TtTTzhbZ6PfwmXNwj6HVk"),
    alt: "Docroom clinical workflow application design",
    summary:
      "Docroom is a healthcare application designed for doctors to manage consultations, review patient records, and track case progress.",
    problem:
      "Doctors often interact with software during busy clinic hours. Existing systems require multiple steps to access patient information, slowing consultations and increasing cognitive effort.",
    users:
      "Primary users were practicing doctors handling multiple patient cases daily. They required an interface that works quickly during continuous usage.",
    approach:
      "I focused on workflow optimization rather than visual styling, reducing the number of steps required to view records, review history, and update case notes.",
    challenges: [
      "High-pressure usage environment",
      "Need for quick information retrieval",
      "Large amount of patient data",
      "Maintaining readability during long usage",
      "Preventing navigation confusion",
    ],
    decisions: [
      "Large readable typography for quick scanning",
      "Clear section grouping of medical data",
      "Timeline view for case understanding",
      "Minimal interface distractions",
      "Accessible action buttons for note updates",
    ],
    outcome:
      "The redesigned application improves workflow efficiency by reducing navigation steps and presenting patient information clearly.",
    learned:
      "In professional tools, clarity and speed are more important than visual richness. A structured interface can improve real-world workflows.",
    gallery: [
      image("9Ro14k3jNkApn2b3ZtKwdfN1uM", 1072, 1636),
      image("5M9Nzof2FotzfaIXQtM3GD3Mw", 1072, 1636),
      image("IhicUveBjXfGaDM0sudZWNLXw"),
    ],
  },
  {
    id: "stayinn",
    eyebrow: "Hospitality & Accommodation",
    title: "Stayinn - Simplifying the Way People Book Stays",
    client: "Stayinn - Mobile App",
    platform: "Mobile Application",
    role: "UI/UX & Interaction Designer",
    objective: "Simplify the stay booking process and help users make confident booking decisions.",
    cover: image("CC18VZCtgGqCVgOOAlfvXUWE"),
    alt: "Mobile app interface Stayinn hotel booking",
    summary:
      "Stayinn is a mobile booking application that allows users to search, compare, and reserve accommodations through a clear and trustworthy booking experience.",
    problem:
      "Booking a stay requires decision-making. Users must compare options, understand pricing, and trust the listing before making a reservation.",
    users:
      "Primary users were travelers looking for short stays and quick bookings. Many users were browsing on mobile devices and needed fast, clear decisions.",
    approach:
      "I designed the experience to support guided decision-making by progressively revealing information as users move closer to booking.",
    challenges: [
      "Large amount of listing information",
      "Too many filtering options",
      "Unclear pricing visibility",
      "Low user confidence before payment",
      "Multi-step booking friction",
    ],
    decisions: [
      "Prominent property images for quick scanning",
      "Clear price breakdown for trust",
      "Rating visibility near property title",
      "Simplified filter options",
      "Strong booking CTA placement",
    ],
    outcome:
      "The redesigned booking flow improves clarity and reduces hesitation during decision-making from search to reservation.",
    learned:
      "Users do not book based on visuals alone. They book when information is clear and decisions feel safe.",
    gallery: [
      image("yfkKE7ezhvxySVyQ6seAvisQdo"),
      image("0KMzNmSwqMEwgTviRVLuSD8PmRw", 1072, 1636),
      image("ChBDn6GQ2d7eRrYz7m7eZe3SbjQ", 2596, 1568),
    ],
  },
  {
    id: "plm",
    eyebrow: "Enterprise SaaS",
    title: "Comprehensive UX/UI Overhaul for Product Lifecycle Management Platform",
    client: "PLM",
    platform: "Enterprise SaaS Web Application",
    role: "UI/UX & Interaction Designer",
    objective:
      "Modernize the PLM platform to reduce workflow friction by 40%, create a scalable design system for future modules, and deliver developer-ready handoff materials within an 8-week timeline.",
    cover: image("H3vzjA8peWqfIPNfvvNNYsOHHQU"),
    alt: "Enterprise product lifecycle management platform redesign",
    summary:
      "This system is a mature Product Lifecycle Management SaaS platform used by enterprise teams to manage complex product development cycles from opportunity creation through program approval, quotation, and financial tracking.",
    problem:
      "The legacy interface suffered from information overload, poor scalability, fragmented experiences, and dense forms without clear hierarchy.",
    users:
      "Primary users included product managers, program leads, finance teams, and approvers who needed to create quotations, manage program status, iterate pricing, and get approvals without rework.",
    approach:
      "I used Jobs-to-be-Done, stakeholder workshops, UX audits, and iterative prototypes to prioritize a scalable design system over one-off screens.",
    challenges: [
      "Balancing 30+ financial fields with scannable table views",
      "Making navigation scale as new workflows were added",
      "Standardizing interactions across complex modules",
      "Bridging design to developer handoff for rapid implementation",
    ],
    decisions: [
      "Focused tables with 5-8 columns plus worksheet forms for 30+ fields",
      "Progressive disclosure from summary to detail",
      "Unified design system to prevent future fragmentation",
      "Contextual save controls that appear only when edits exist",
      "Inline edit, toast notifications, keyboard shortcuts, and bulk actions",
    ],
    outcome:
      "Core quotation workflows required 40% fewer steps, developer handoff questions dropped by 70%, and the platform gained a foundation for future modules.",
    learned:
      "Enterprise UX requires ruthless prioritization: solve the workflows causing the most pain first, then scale the system around them.",
    gallery: [image("HvAo32bFkLB70Fpv3UapXnyxEk")],
  },
];

export { image };
