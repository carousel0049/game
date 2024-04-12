import './index.scss';
import {memo, useCallback, useEffect, useState} from 'react';
import TicketCard from "../../components/ticket-card";

function Main() {
  const [firstField, setFirstField] = useState( JSON.parse(localStorage.getItem("firstField")) || []);
  const [secondField, setSecondField] = useState(JSON.parse(localStorage.getItem("secondField")) || []);
  const [winningNumbersFirstField, setWinningNumbersFirstField] = useState(null);
  const [winningNumberSecondField, setWinningNumberSecondField] = useState(null);
  const [isTicketWon, setIsTicketWon] = useState(null);
  const [pending, setPending] = useState(false);

  const onRandomGenerate = useCallback(() => {

    const minFirstField = 1;
    const maxFirstField = 19;
    const minSecondField = 1;
    const maxSecondField = 2;

    const shuffledNumbers = Array
      .from({ length: maxFirstField - minFirstField + 1 }, (_, i) => i + minFirstField)
      .sort(() => Math.random() - 0.5);

    const firstFieldRandomNumbers = shuffledNumbers.slice(0, 8);
    const secondFieldRandomNumber = Math.floor(Math.random() * (maxSecondField - minSecondField + 1)) + minSecondField;

    setFirstField(firstFieldRandomNumbers);
    setSecondField([secondFieldRandomNumber]);
    localStorage.setItem("firstField", JSON.stringify(firstFieldRandomNumbers));
    localStorage.setItem("secondField", JSON.stringify([secondFieldRandomNumber]));
  }, []);
  const onWiningNumbersRandomGenerate = useCallback(() => {
    const minFirstField = 1;
    const maxFirstField = 19;
    const minSecondField = 1;
    const maxSecondField = 2;

    const shuffledNumbers = Array
      .from({ length: maxFirstField - minFirstField + 1 }, (_, i) => i + minFirstField)
      .sort(() => Math.random() - 0.5);

    const firstFieldRandomNumbers = shuffledNumbers.slice(0, 8);
    const secondFieldRandomNumber = Math.floor(Math.random() * (maxSecondField - minSecondField + 1)) + minSecondField;

    setWinningNumbersFirstField(firstFieldRandomNumbers);
    setWinningNumberSecondField([secondFieldRandomNumber]);
    console.log("firstFieldWiningNumbers", firstFieldRandomNumbers);
    console.log("secondFieldWiningNumber", secondFieldRandomNumber);
  }, [])
  const onCheckTicketWon = useCallback((userNumbers, winningNumbersFirstField, winningNumberSecondField) => {
    const matchedNumbersFirstField = userNumbers.firstField.filter(number => winningNumbersFirstField.includes(number)).length;
    const matchedNumberSecondField = userNumbers.secondField.includes(winningNumberSecondField) ? 1 : 0;

    if ((matchedNumbersFirstField >= 4) || (matchedNumbersFirstField >= 3 && matchedNumberSecondField === 1)) {
      return true;
    } else {
      return false;
    }
  }, []);
  const onReset = useCallback(() => {
    setIsTicketWon(null);
    setFirstField([]);
    setSecondField([]);
    onWiningNumbersRandomGenerate()
    localStorage.removeItem("firstField");
    localStorage.removeItem("secondField");
  }, [onWiningNumbersRandomGenerate]);
  const onSubmit = useCallback(() => {
      if (firstField.length !== 8 || secondField.length !== 1) {
        return alert('Выбрано недостаточное количество чисел!');
      }
      setPending(true);
      setIsTicketWon(onCheckTicketWon({firstField, secondField}, winningNumbersFirstField, winningNumberSecondField))
      const submitRequest = () => {

        return fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify({
            selectedNumber: {
              firstField: firstField,
              secondField: secondField,
              isTicketWon: onCheckTicketWon({firstField, secondField}, winningNumbersFirstField, winningNumberSecondField)
            }
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .catch((err) => {
            console.error('Error:', err);
            throw err; // Propagate the error for further handling
          });
      };
      const handleRetry = (retryCount) => {
        if (retryCount <= 0) {
          alert('Не удалось выполнить запрос после нескольких попыток');
          setPending(false);
          onReset();
          return;
        }
        setTimeout(() => {
          console.log(`Retrying request. Attempts left: ${retryCount}`);
          submitRequest()
            .then((data) => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Retry failed:', error);
              handleRetry(retryCount - 1);
            });
        }, 2000);
      };

      submitRequest()
        .then((data) => {
          console.log('Success:', data);
          setPending(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          handleRetry(2);
        });
    },
    [
      onReset,
      firstField,
      secondField,
      onCheckTicketWon,
      winningNumbersFirstField,
      winningNumberSecondField
    ]);

  useEffect(() => {
    return onWiningNumbersRandomGenerate()
  }, [onWiningNumbersRandomGenerate]);

  return (
    <div className="main">
      <TicketCard
        isTicketWon={isTicketWon}
        onRandomGenerate={onRandomGenerate}
        firstField={firstField}
        setFirstField={setFirstField}
        secondField={secondField}
        setSecondField={setSecondField}
        onReset={onReset}
        onSubmit={onSubmit}
        pending={pending}
      />
    </div>
  );
}

export default memo(Main);
