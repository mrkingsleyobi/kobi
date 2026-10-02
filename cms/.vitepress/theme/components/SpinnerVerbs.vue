<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// Full spinner-verb pool reverse-engineered from danielmiessler.com's live
// theme bundle (the `qt` array backing SpinnerVerbs.vue there) - 537 entries
// spanning ML/security/philosophy/sci-fi references. Daniel's version picks a
// random verb (no repeat) + random icon/color/animation on each tick; we keep
// the same random-no-repeat verb picker but pair it with a small emoji icon
// pool since we don't ship his FontAwesome icon font.
const spinnerVerbs: string[] = [
  "Krahing", "Hill-climbing", "Observing", "Reverse-engineering", "Verifying",
  "Pressure-testing", "Blossoming", "Iterating", "Decomposing", "Pattern-matching",
  "Augmenting", "Prompting", "Weaving", "Naming the wind", "Calling the wind",
  "Sympathy-linking", "Binding", "Shaping", "Chandrian-hunting",
  "Opening the thrice-locked chest", "Entering the Archives", "Walking the Kvothe path",
  "Leveling up", "Cultivating", "Ascending", "Dungeon-crawling", "Looting", "Min-maxing",
  "Respawning", "Grinding XP", "Skill-checking", "Primal-hunting", "Boss-fighting",
  "Rage-quitting gracefully", "Jacking in", "Flatlining", "ICE-breaking", "Decking",
  "Sprawling", "Console-cowboying", "Wintermuting", "Neuromancing", "Snow-crashing",
  "Metaversing", "Tessering", "Folding space", "Spice-flowing", "Sandworming",
  "Kwisatz-haderaching", "Bene-gesseriting", "Litany-of-fearing", "Shai-huluding",
  "Stilgar-approving", "Warp-driving", "Making it so", "Engaging", "Boldly going",
  "Beaming up", "Replicating", "Red-alerting", "Holodeck-running", "Prime-directing",
  "Picard-maneuvering", "Resisting-is-futiling", "Mind-melding", "Logically-proceeding",
  "Fascinating-ing", "Grokking", "Stranging in a strange land", "Asimov-computing",
  "Foundation-building", "Psychohistorying", "Seldon-planning", "Three-body-probleming",
  "Dark-foresting", "Ringworld-engineering", "Hyperion-pilgriming", "Shrike-encountering",
  "Time-tombing", "Murderbot-diarying", "All-systems-redding", "Ender-gaming",
  "Speaker-for-the-deading", "Matrixing", "Red-pilling", "Bullet-timing", "Tesseracting",
  "Interstellaring", "Docking", "Gargantua-orbiting", "Cooper-falling", "Murphing",
  "Love-transcending-time", "Bending spoons", "Unplugging", "Choosing the red pill",
  "Following the white rabbit", "Dojoeing", "Downloading kung fu", "There-is-no-spooning",
  "Dodging bullets", "Sentinel-surfing", "Zion-raving", "Architect-meeting",
  "Oracle-consulting", "Smith-multiplying", "Keymaker-finding", "Merovingian-philosophizing",
  "Source-entering", "System-resetting", "Trinity-hacking", "Morpheus-believing", "Neo-flying",
  "One-becoming", "Rage-against-machining", "Lateralus-spiraling", "Schism-ing",
  "Forty-six-and-twoing", "Pneuma-breathing", "Fear-inoculuming", "Vicarious-viewing",
  "Aenima-flushing", "Parabola-swinging", "Sober-channeling", "Jambi-wishing",
  "Grudge-bearing", "Descending-ing", "Invincible-standing", "Not-going-gentle",
  "Rage-raging-against-dying-light", "Royale-with-cheesing", "Ezekiel-25-17ing",
  "Getting-medieval", "Snatch-scheming", "Turkish-negotiating", "Spiraling-out",
  "Lateralizing", "Forty-sixing-and-twoing", "Meshuggah-polyrhythming", "Djent-chugging",
  "Boris-brejcha-minimal-teching", "Double-bass-blasting", "Para-diddling",
  "Meaning-searching", "Logotherapying", "Will-to-meaning", "Second-mountaining",
  "Beginning-of-infinitying", "Conjecture-refuting", "Explanation-reaching", "Red-queening",
  "Evolving", "Homo-deusing", "Next-token-predicting", "World-modeling", "Context-engineering",
  "Fabric-patterning", "Extract-wisdoming", "Summarizing", "SecListing", "Fuzzing",
  "Pentesting", "Threat-modeling", "Red-teaming", "OWASP-checking", "Vuln-scanning",
  "Airborne-qualifying", "Air-assaulting", "Hooah-ing", "All-the-waying", "Rucking",
  "Roger-that-ing", "Zero-daying", "Buffer-overflowing", "Packet-sniffing", "Port-scanning",
  "Human-3-pointing-zeroing", "Creator-economying", "Meaning-creating", "Upgrading",
  "Self-expressing", "Ideal-stating", "Euphoric-surprising", "Hill-climbing-toward-ideal",
  "Criteria-blossoming", "Anti-criteria-hunting", "Algorithm-running", "Seven-phasing",
  "Quality-gating", "ISA-writing", "Swarm-deploying", "Agent-spawning", "Delegating",
  "Parallelizing", "Background-tasking", "Caffeinating", "Pour-overing",
  "Dialing-in-the-grind", "Extracting", "Tamping", "Cupping", "Typesetting", "Kerning",
  "Leading", "Calligraphing", "Federation-building", "Utopia-engineering",
  "Meritocracy-ensuring", "Consciousness-pondering", "Sentience-detecting", "Qualia-examining",
  "Turing-testing", "Chinese-rooming", "Ship-of-Theseusing", "Trolley-probleming",
  "Thought-experimenting", "First-principling", "Root-causing", "Simplifying",
  "Occam-razoring", "Signal-extracting", "Noise-filtering", "Existential-meaning-making",
  "Memento-mori-ing", "Carpe-dieming", "Amor-fati-ing", "Philosophizing", "Sonder-feeling",
  "Eudaimonia-chasing", "Polymathing", "Renaissance-manning", "Autodidacting", "Deep-working",
  "Flow-stating", "Mise-en-placing", "Kaizen-improving", "Wabi-sabi-accepting",
  "Kintsugi-repairing", "Bushido-following", "Ronin-wandering", "Samurai-coding",
  "Seppuku-refactoring", "Zazen-meditating", "Koan-contemplating", "Mu-answering",
  "Void-gazing", "Dragon-slaying", "Dungeon-mastering", "Nat-twentying", "Critical-hitting",
  "Saving-throwing", "Mana-channeling", "Spell-weaving", "Rune-carving", "Lore-gathering",
  "Quest-completing", "Side-questing", "NPC-consulting", "Respawn-buffering",
  "Achievement-unlocking", "Easter-egg-finding", "Speed-running", "New-game-plussing",
  "Git-pushing", "Branch-merging", "CI-pipelining", "Docker-containerizing",
  "Kubernetes-orchestrating", "Terraform-provisioning", "Bun-installing",
  "TypeScript-compiling", "REPL-looping", "Rubber-duck-debugging", "Stack-overflowing",
  "Yak-shaving", "Bikeshedding", "Ship-it-squirreling", "LGTM-approving", "Chmod-777ing",
  "Stormlight-archiving", "Kaladin-windrunning", "Shardblade-summoning", "Stormwall-surfing",
  "Bridge-four-running", "Ready-player-oneing", "OASIS-logging-in", "Prime-intellecting",
  "Singularity-approaching", "Lexicon-hacking", "WoW-raiding", "Premeditatio-malorum-ing",
  "Dichotomy-of-controlling", "Obstacle-is-the-waying", "Negative-visualizing",
  "Ego-is-the-enemying", "Stillness-is-the-keying", "Journaling-like-Marcus", "Stoic-enduring",
  "Voluntary-discomforting", "Sympatheia-feeling", "Practicing-dying-daily",
  "Inner-citadel-fortifying", "Preferred-indifferenting", "Virtue-as-sole-gooding",
  "Epictetus-distinguishing", "Seneca-lettering", "Chrysippus-logic-chopping",
  "Diogenes-barrel-dwelling", "Nietzsche-abyssing", "Ubermensch-becoming", "Eternal-recurring",
  "Sisyphus-imagining-happy", "Absurd-embracing", "Cave-allegory-escaping",
  "Platonic-form-seeking", "Cogito-ergo-summing", "Categorical-imperative-testing",
  "Dasein-being-there", "Will-to-powering", "Tabula-rasa-starting", "Dialectic-synthesizing",
  "Phenomenology-reducing", "Hermeneutic-circling", "Sapere-aude-daring", "Aporia-puzzling",
  "Elenchus-questioning", "Phishing-detecting", "Credential-stuffing", "Hash-cracking",
  "Privilege-escalating", "Lateral-moving", "C2-beaconing", "Payload-delivering",
  "Shellcode-injecting", "Reverse-shelling", "Exfiltrating", "Persistence-establishing",
  "IOC-hunting", "SIEM-correlating", "Log-forensicing", "Memory-dumping", "Packet-crafting",
  "SSL-stripping", "DNS-tunneling", "WAF-bypassing", "CSRF-tokening", "XSS-reflecting",
  "SQLi-unionizing", "SSRF-chaining", "JWT-forging", "OAuth-redirecting", "API-enumerating",
  "Cloud-misconfiguring", "Container-escaping", "Supply-chain-auditing", "MITRE-ATTACKing",
  "Kill-chain-mapping", "Diamond-modeling", "CVE-triaging", "Patch-Tuesday-surviving",
  "Bug-bountying", "Responsible-disclosing", "Gradient-descending", "Backpropagating",
  "Loss-minimizing", "Weight-updating", "Attention-heading", "Transformer-encoding",
  "Embedding-projecting", "Softmax-normalizing", "Batch-normalizing", "Dropout-regularizing",
  "Epoch-training", "Hyperparameter-tuning", "Learning-rate-scheduling", "Adam-optimizing",
  "Cross-entropy-computing", "Feature-extracting", "Latent-space-traversing",
  "Autoencoder-compressing", "GAN-generating", "Discriminator-fooling", "Diffusion-denoising",
  "Token-predicting", "Context-windowing", "KV-caching", "Beam-searching",
  "Temperature-sampling", "Top-k-filtering", "Nucleus-sampling", "Perplexity-measuring",
  "BLEU-scoring", "Fine-tuning", "LoRA-adapting", "Quantizing", "Pruning",
  "Knowledge-distilling", "RLHF-aligning", "Reward-modeling", "PPO-clipping",
  "Constitutional-AI-ing", "Chain-of-thought-reasoning", "In-context-learning",
  "Few-shot-prompting", "Zero-shot-inferring", "Retrieval-augmenting",
  "Cosine-similarity-computing", "Vector-searching", "Tokenizing", "Positional-encoding",
  "Residual-connecting", "Layer-norming", "Multi-head-attending", "Self-attending",
  "Cross-attending", "Feedforward-passing", "Activation-ReLUing", "Sigmoid-squashing",
  "Convolution-filtering", "Pooling", "Overfitting-early-stopping", "Validation-splitting",
  "Confusion-matrix-reading", "ROC-curving", "F1-scoring", "Ablation-studying", "Subliming",
  "Mind-state-running", "GSV-deploying", "Gridfire-channeling", "Neural-lacing", "Displacing",
  "Effector-wielding", "Knife-missile-guiding", "Orbital-spinning", "Special-circumstancing",
  "Outside-context-probleming", "Gravitas-insufficient-noting", "Drug-gland-tweaking",
  "Glanding-snap", "Glanding-sharp-blue", "Glanding-quicken", "Glanding-sperk",
  "Glanding-calm", "Glanding-gain", "Glanding-charge", "Glanding-recall", "Glanding-diffuse",
  "Glanding-somnabsolute", "Glanding-softnow", "Glanding-focal", "Glanding-edge",
  "Glanding-drill", "Glanding-gung", "Glanding-winnow", "Glanding-crystal-fugue-state",
  "Glanding-keen", "Glanding-lucid", "Glanding-parse", "Glanding-delve", "Glanding-coldmind",
  "Glanding-bloom", "Glanding-glow", "Glanding-float", "Glanding-bliss", "Glanding-deepcalm",
  "Glanding-dampen", "Glanding-veil", "Glanding-quell", "Glanding-numb", "Glanding-staunch",
  "Glanding-tight", "Glanding-fierce", "Glanding-spike", "Glanding-hone", "Glanding-surge",
  "Glanding-wide", "Glanding-bright", "Glanding-nightwide", "Glanding-slowtime",
  "Glanding-acute", "Glanding-jolt", "Glanding-balm", "Glanding-torpor", "Glanding-flush",
  "Glanding-thrum", "Glanding-sleek", "Glanding-meld", "Glanding-sync", "Glanding-rapport",
  "Glanding-spark", "Glanding-flux", "Glanding-drift", "Glanding-weave", "Glanding-lace",
  "Glanding-trance", "Glanding-haze", "Glanding-shimmer", "Glanding-warp", "Glanding-slumber",
  "Glanding-wake", "Glanding-vivid", "Glanding-crash", "Genofixing", "Slap-drone-dispatching",
  "Hyperspace-transiting", "Excession-handling", "Infinite-fun-spacing", "ROU-fast-picketing",
  "Hegswarm-resisting", "Affront-affronting", "Consider-Phlebasing", "Windward-looking",
  "Player-of-gaming", "Zakalwe-scheming", "Sleeper-Service-waking",
  "Mistake-Not-underestimating", "Sense-amid-madness-finding",
  "Lightly-searing-on-the-reality-grill", "Just-reading-the-instructions",
  "Of-course-still-loving-you", "Hydrogen-Sonata-playing", "Cato-marching", "Glancing",
  "Routing", "Dispatching", "Triaging", "Countersigning", "Ledgering", "Falsifying",
  "Ratcheting", "Probing", "Asserting", "Cross-checking", "Grading", "Enriching", "Projecting"
]
const spinnerIcons = ["\ud83e\udd14", "\ud83d\udd2e", "\ud83e\ude9f", "\u2728", "\ud83e\udde0", "\u26a1", "\ud83c\udf00", "\ud83d\udd2c", "\ud83e\uddea", "\ud83d\udda5\ufe0f"]
const currentIcon = ref(spinnerIcons[0])
const currentVerb = ref(spinnerVerbs[0])
let lastIndex = -1
let interval: ReturnType<typeof setInterval> | null = null
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function tick() {
  let next = Math.floor(Math.random() * spinnerVerbs.length)
  while (next === lastIndex && spinnerVerbs.length > 1) {
    next = Math.floor(Math.random() * spinnerVerbs.length)
  }
  lastIndex = next
  currentVerb.value = spinnerVerbs[next]
  currentIcon.value = pick(spinnerIcons)
}
onMounted(() => {
  tick()
  interval = setInterval(tick, 4000)
})
onUnmounted(() => {
  if (interval !== null) clearInterval(interval)
})
</script>
<template>
  <div class="bsl-spinner" aria-hidden="true">
    {{ currentIcon }} {{ currentVerb }}…
  </div>
</template>
