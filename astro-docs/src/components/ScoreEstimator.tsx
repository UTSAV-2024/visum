import { useMemo, useState } from 'react';

type Signal = {
	key: string;
	label: string;
	weight: number;
};

const SIGNALS: Signal[] = [
	{ key: 'llmsTxt', label: 'Has an llms.txt file', weight: 20 },
	{ key: 'structuredData', label: 'Uses structured data (schema.org)', weight: 20 },
	{ key: 'crawlable', label: 'Content is server-rendered / crawlable', weight: 25 },
	{ key: 'citations', label: 'Cited by other sites or AI answers', weight: 20 },
	{ key: 'freshness', label: 'Content updated in the last 90 days', weight: 15 },
];

export default function ScoreEstimator() {
	const [checked, setChecked] = useState<Record<string, boolean>>({});

	const score = useMemo(
		() => SIGNALS.reduce((total, s) => total + (checked[s.key] ? s.weight : 0), 0),
		[checked]
	);

	const band = score >= 80 ? 'Strong' : score >= 50 ? 'Developing' : 'At risk';

	return (
		<div className="estimator">
			<div className="estimator-list">
				{SIGNALS.map((s) => (
					<label key={s.key} className="estimator-row">
						<input
							type="checkbox"
							checked={!!checked[s.key]}
							onChange={(e) =>
								setChecked((prev) => ({ ...prev, [s.key]: e.target.checked }))
							}
						/>
						<span>{s.label}</span>
						<span className="estimator-weight">+{s.weight}</span>
					</label>
				))}
			</div>

			<div className="estimator-result">
				<div className="estimator-score">{score}</div>
				<div className="estimator-band" data-band={band}>
					{band}
				</div>
			</div>

			<style>{`
				.estimator {
					border: 1px solid #2a2d34;
					background: #15171c;
					border-radius: 12px;
					padding: 1.25rem;
					display: grid;
					gap: 1rem;
				}
				.estimator-list {
					display: grid;
					gap: 0.5rem;
				}
				.estimator-row {
					display: flex;
					align-items: center;
					gap: 0.6rem;
					font-size: 0.92rem;
					color: #e7e8ea;
					cursor: pointer;
				}
				.estimator-weight {
					margin-left: auto;
					color: #9aa0ac;
					font-size: 0.8rem;
				}
				.estimator-result {
					display: flex;
					align-items: baseline;
					gap: 0.75rem;
					border-top: 1px solid #2a2d34;
					padding-top: 1rem;
				}
				.estimator-score {
					font-size: 2.25rem;
					font-weight: 700;
					color: #7c9dff;
					letter-spacing: -0.02em;
				}
				.estimator-band {
					font-size: 0.85rem;
					color: #9aa0ac;
				}
			`}</style>
		</div>
	);
}
