import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";


type TriviaCategory = {
  id: number;
  name: string;
};

export type TriviaQuestion = {
  category: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type TriviaContextType = {
  categories: TriviaCategory[];
  questions: TriviaQuestion[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  loading: boolean;
  error: string | null;
  refetchQuestions: (amount?: number) => Promise<void>;
  visibleQuestions: TriviaQuestion[];
  categoryDistribution: { name: string; value: number }[];
  difficultyDistribution: {
    name: TriviaQuestion["difficulty"];
    value: number;
  }[];
  uniqueQuestionCategories: string[];
};

const TriviaContext = createContext<TriviaContextType | undefined>(undefined);

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

//helper if i get response that server is busy, it will wait 600ms, then it will try again
//if response is busy again it will try again after 1200ms
async function fetchWithRetry(
  url: string,
  retries = 3,
  backoffMs = 600
): Promise<Response> {
  let attempt = 0;
  while (true) {
    const response = await fetch(url);
    if (response.ok) return response;
    if (
      (response.status === 429 || response.status === 503) &&
      attempt < retries
    ) {
      const delay = backoffMs * Math.pow(2, attempt);
      await sleep(delay);
      attempt += 1;
      continue;
    }
    throw new Error(`Request failed: ${response.status}`);
  }
}

const DIFFICULTY_LABELS: Array<TriviaQuestion["difficulty"]> = [
  "easy",
  "medium",
  "hard",
];

type TriviaProviderProps = { children: React.ReactNode };

export const TriviaProvider: React.FC<TriviaProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<TriviaCategory[]>([]);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (amount = 50) => {
    let isMounted = true;
    try {
      setLoading(true);
      setError(null);

      const [catRes, qRes] = await Promise.all([
        fetchWithRetry("https://opentdb.com/api_category.php"),
        fetchWithRetry(`https://opentdb.com/api.php?amount=${amount}`),
      ]);

      if (!catRes.ok || !qRes.ok) {
        throw new Error("Failed to fetch from API");
      }

      const catJson: { trivia_categories: TriviaCategory[] } =
        await catRes.json();
      const qJson: { response_code: number; results: TriviaQuestion[] } =
        await qRes.json();

      if (qJson.response_code !== 0) {
        throw new Error("Trivia API returned an error code");
      }

      if (!isMounted) return;

      // data comes encoded, to avoid letter displayed as &amp im using decoder
      const decodedCategories = catJson.trivia_categories.map((cat) => ({
        ...cat,
        name: decodeHtmlEntities(cat.name),
      }));
      const decodedQuestions = qJson.results.map((q) => ({
        ...q,
        category: decodeHtmlEntities(q.category),
        question: decodeHtmlEntities(q.question),
        correct_answer: decodeHtmlEntities(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map((ans) =>
          decodeHtmlEntities(ans)
        ),
      }));

      setCategories(decodedCategories);
      setQuestions(decodedQuestions);
    } catch (e: unknown) {
      if (!isMounted) return;
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      if (isMounted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refetchQuestions = useCallback(
    async (amount = 50) => {
      await loadData(amount);
    },
    [loadData]
  );

  const decodeHtmlEntities = (text: string): string => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  const visibleQuestions = useMemo(() => {
    if (selectedCategory === "all") return questions;
    return questions.filter((q) => q.category === selectedCategory);
  }, [questions, selectedCategory]);

  const categoryDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    visibleQuestions.forEach((q) => {
      counts.set(q.category, (counts.get(q.category) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [visibleQuestions]);

  const difficultyDistribution = useMemo(() => {
    const counts = new Map<TriviaQuestion["difficulty"], number>();
    DIFFICULTY_LABELS.forEach((d) => counts.set(d, 0));
    visibleQuestions.forEach((q) => {
      counts.set(q.difficulty, (counts.get(q.difficulty) ?? 0) + 1);
    });
    return DIFFICULTY_LABELS.map((name) => ({
      name,
      value: counts.get(name) ?? 0,
    }));
  }, [visibleQuestions]);

  const uniqueQuestionCategories = useMemo(() => {
    const setNames = new Set(questions.map((q) => q.category));
    return Array.from(setNames.values()).sort();
  }, [questions]);

  const value = useMemo(
    () => ({
      categories,
      questions,
      selectedCategory,
      setSelectedCategory,
      loading,
      error,
      refetchQuestions,
      visibleQuestions,
      categoryDistribution,
      difficultyDistribution,
      uniqueQuestionCategories,
    }),
    [
      categories,
      questions,
      selectedCategory,
      loading,
      error,
      refetchQuestions,
      visibleQuestions,
      categoryDistribution,
      difficultyDistribution,
      uniqueQuestionCategories,
    ]
  );

  return (
    <TriviaContext.Provider value={value}>{children}</TriviaContext.Provider>
  );
};

export const useTrivia = () => {
  const context = useContext(TriviaContext);
  if (context === undefined) {
    throw new Error("useTrivia must be used within a TriviaProvider");
  }
  return context;
};
