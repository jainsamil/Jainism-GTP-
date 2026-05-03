import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  const cols = ['knowledge', 'tirthankars', 'aagams', 'history', 'festivals'];
  for (const col of cols) {
    try {
      console.log(`Testing ${col}...`);
      const snap = await getDocs(collection(db, col));
      console.log(`Read ${col} OK`);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, col, d.id));
      }
      console.log(`Delete ${col} OK`);
      await addDoc(collection(db, col), { test: true });
      console.log(`Write ${col} OK`);
    } catch (e) {
      console.error(`Failed on ${col}:`, e);
    }
  }
  process.exit(0);
}
test();
