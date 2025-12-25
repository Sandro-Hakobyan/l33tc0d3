import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

/* ===================== DATA ===================== */

const WORDS = [
  "c1b3r", "h4ck", "d4t4", "byt3", "crypt0",
  "z3r0", "m4tr1x", "n3t", "c0d3", "l0g1c",
  "f1r3", "n0d3", "l00p", "4lph4", "b3t4",
  "g4mm4", "d3lt4", "s1gm4", "pr0t0", "sh3ll"
];

const OFFLINE_MAP = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "6": "G",
};

const offlineDecode = (text) =>
  text
    .split("")
    .map((c) => OFFLINE_MAP[c] ?? c)
    .join("");

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* ===================== APP ===================== */

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  /* -------- decode (SERVER → fallback LOCAL) -------- */
  const decode = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setOutput("");

    try {
      const res = await fetch(
        "https://00b7e511-6d2b-4efe-b3c1-ec16a6c35c48-00-1sq47ion88qnz.riker.replit.dev/api/decode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify({ text: input }),
        }
      );

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setOutput(data.decoded || "No response");

    } catch (err) {
      // 🔥 Offline fallback
      await delay(400);
      setOutput(offlineDecode(input));
    } finally {
      setLoading(false);
    }
  };

  /* -------- random example -------- */
  const generateExample = () => {
    const count = Math.floor(Math.random() * 3) + 2;
    const text = Array.from({ length: count }, () =>
      WORDS[Math.floor(Math.random() * WORDS.length)]
    ).join(" ");
    setInput(text);
  };

  /* -------- hackerify -------- */
  const hackerify = () => {
    const subs = { o: "0", e: "3", i: "1", a: "4", G: "6" };
    let result = "";
    for (const c of input) {
      result += subs[c] && Math.random() < 0.5 ? subs[c] : c;
    }
    setInput(result);
  };

  /* ===================== UI ===================== */

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Gibberish → Human</Text>

      {/* INPUT + DECODE INLINE */}
      <View style={styles.row}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Enter gibberish"
          placeholderTextColor="#6affc4"
          style={styles.input}
        />
        <TouchableOpacity style={styles.decodeBtn} onPress={decode}>
          <Text style={styles.decodeText}>
            {loading ? "…" : "Decode"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={generateExample}>
          <Text style={styles.actionText}>Generate Example</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={hackerify}>
          <Text style={styles.actionText}>Hackerify</Text>
        </TouchableOpacity>
      </View>

      {/* OUTPUT */}
      <Text style={styles.outTitle}>Decoded Output</Text>
      <ScrollView style={styles.outputBox}>
        <Text style={styles.outputText}>{output}</Text>
      </ScrollView>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0b0f0d",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#00ff9d",
    fontWeight: "700",
    marginBottom: 20,
    fontFamily: "monospace",
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: "#00ff9d",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    paddingHorizontal: 14,
    color: "#00ff9d",
    fontFamily: "monospace",
    fontSize: 16,
  },
  decodeBtn: {
    width: 110,
    backgroundColor: "#00ff9d",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  decodeText: {
    color: "#0b0f0d",
    fontWeight: "800",
    fontSize: 16,
    fontFamily: "monospace",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00ff9d",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  actionText: {
    color: "#00ff9d",
    fontWeight: "700",
    fontFamily: "monospace",
  },
  outTitle: {
    color: "#00ff9d",
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "monospace",
  },
  outputBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#00ff9d",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#111",
  },
  outputText: {
    color: "#00ff9d",
    fontSize: 16,
    fontFamily: "monospace",
  },
});
