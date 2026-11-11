// Left panel of the home page: 7 slots reserved for categories.
// Put the category names in this list when they are decided (empty = free slot).
const ITEMS = ["", "", "", "", "", "", ""];

export default function SideMenu() {
  return (
    <aside className="side-menu" aria-label="Categories">
      <ul>
        {ITEMS.map((name, i) => (
          <li key={i} className={name ? "" : "free"}>{name || "\u00a0"}</li>
        ))}
      </ul>
    </aside>
  );
}
