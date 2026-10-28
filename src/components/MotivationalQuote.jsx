import { useState, useMemo, useCallback } from 'react';
import { LoaderIcon } from '../assets/icons';
import { useGetQuotes } from '../hooks/data/use-get-quotes';
import Button from './Button';

const MotivationalQuote = () => {
  const { data: quotes, isLoading, isError } = useGetQuotes();
  const [currentIndex, setCurrentIndex] = useState(null);

  // Sorteia o índice inicial quando os dados chegam da API
  useMemo(() => {
    if (quotes && quotes.length > 0 && currentIndex === null) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentIndex(randomIndex);
    }
  }, [quotes, currentIndex]);

  // Função para sortear uma nova frase
  const handleNextQuote = useCallback(() => {
    if (!quotes || quotes.length <= 1) return;

    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentIndex); // Garante que não repete a mesma frase seguida

    setCurrentIndex(newIndex);
  }, [quotes, currentIndex]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <LoaderIcon className="animate-spin text-brand-dark-blue" />
      </div>
    );
  }

  if (isError || !quotes || quotes.length === 0 || currentIndex === null) {
    return (
      <p className="text-sm text-brand-text-gray">
        Não foi possível carregar a frase motivacional no momento.
      </p>
    );
  }

  const currentQuote = quotes[currentIndex];

  return (
    <div className="min-h-30 flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <p className="italic text-brand-dark-blue">
          &ldquo;{currentQuote.frase}&rdquo;
        </p>
        {currentQuote.autor && (
          <span className="block text-xs font-semibold text-brand-text-gray">
            — {currentQuote.autor}
          </span>
        )}
      </div>
      <div>
        <Button color="secondary" onClick={handleNextQuote}>
          Gerar outra
        </Button>
      </div>
    </div>
  );
};

export default MotivationalQuote;
