import { organizations } from "@/data/site";
export default function Organizations() {
  return (
    <section className="organizations container">
      <div className="org-caption">PART OF A WIDER CYBERSECURITY COMMUNITY</div>
      <div className="org-grid">
        {organizations.map((org, i) => (
          <div key={org}>
            <span className="org-mark">{["AD", "G", "D", "TF"][i]}</span>
            <strong>{org}</strong>
          </div>
        ))}
      </div>
      <p>
        Organizations related to our competitions and achievements. Inclusion
        does not imply an official sponsorship or partnership.
      </p>
    </section>
  );
}
