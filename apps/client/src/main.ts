import './ui/style.css';
import { bootstrap } from './game/bootstrap';

bootstrap().catch((err) => {
  console.error(err);
  const el = document.getElementById('ui');
  if (el) el.innerHTML = `<div class="fatal"><h1>Erreur au démarrage</h1><pre>${String(err?.stack ?? err)}</pre></div>`;
});
