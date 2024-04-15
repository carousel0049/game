import './index.scss';
import {memo} from 'react';
import cn from "classnames";
import PropTypes from "prop-types";
import { BsMagic } from "react-icons/bs";
import createArrayOfNumbers, {removeDuplicates} from "../../utils";

const arr1 = createArrayOfNumbers(19);
const arr2 = createArrayOfNumbers(2);

function TicketCard({
isTicketWon,
onRandomGenerate,
firstField,
setFirstField,
secondField,
setSecondField,
onReset,
onSubmit,
pending
}) {

  return (
    <div className="ticket_card">
      <div className="ticket_card_in">
        <div className="ticket_card_header">
          <div className="ticket_card_header_title">
            <h3>Билет 1</h3>
            {isTicketWon === null && (
              <span onClick={onRandomGenerate}>
                <BsMagic />
              </span>
            )}
          </div>
          {isTicketWon === null && (
            <div className="ticket_card_header_in">
              <p>Поле 1</p>
              <span>Отметьте 8 чисел</span>
            </div>
          )}
          {isTicketWon !== null && (
            <div className="ticket_card_header_in">
              <span>
                {isTicketWon === true ? "Ого, вы выиграли! Поздравляем!" : "Упс, вы проиграли!"}
              </span>
            </div>
          )}
        </div>
        {isTicketWon === null && (
          <>
            <div className="ticket_card_numbers">
              {arr1.map((el, index) => (
                <div
                  key={index}
                  className={cn(
                    "ticket_card_numbers_btn",
                    {"ticket_card_numbers_btn--active" : firstField.includes(Number(el))}
                  )}
                  onClick={() => {
                    if (!firstField.includes(Number(el))) {
                      if (firstField.length >= 8) {
                        return alert("Можно вынрать только 8 чисел")
                      }
                      setFirstField((removeDuplicates([...firstField, Number(el)])));
                      localStorage.setItem("firstField", JSON.stringify(removeDuplicates([...firstField, Number(el)])))
                    } else {
                      setFirstField(firstField.filter(number => number !== el));
                      localStorage.setItem("firstField", JSON.stringify(firstField.filter(number => number !== el)))
                    }
                  }}
                >{el}</div>
              ))}
            </div>
            <div className="ticket_card_header">
              <div className="ticket_card_header_in">
                <p>Поле 1</p>
                <span>Отметьте 1 число</span>
              </div>
            </div>
            <div className="ticket_card_numbers">
              {arr2.map((el, index) => (
                <div
                  key={index}
                  className={cn(
                    "ticket_card_numbers_btn",
                    {"ticket_card_numbers_btn--active" : secondField.includes(Number(el))}
                  )}
                  onClick={() => {
                    if (!secondField.includes(Number(el))) {
                      if (secondField.length >= 1) {
                        return alert("Можно вынрать только 1 число")
                      }
                      setSecondField((removeDuplicates([...secondField, Number(el)])));
                      localStorage.setItem("secondField", JSON.stringify(removeDuplicates([...secondField, Number(el)])))
                    } else {
                      setSecondField(secondField.filter(number => number !== el));
                      localStorage.setItem("secondField", JSON.stringify(secondField.filter(number => number !== el)))
                    }
                  }}
                >{el}</div>
              ))}
            </div>
          </>
        )}
        <div className="ticket_card_actions">
          {isTicketWon === null && (
            <button
              className="ticket_card_actions_btn"
              onClick={() => {
                if (pending) {
                  return
                }
                return onSubmit()
              }}
            >{pending ? "Загрузка..." : "Показать результат"}</button>
          )}
          {isTicketWon !== null && (
            <button
              className="ticket_card_actions_btn"
              onClick={onReset}
            >Начать снова</button>
          )}
        </div>
      </div>
    </div>
  );
}

TicketCard.propTypes = {
  isTicketWon: PropTypes.bool,
  onRandomGenerate: PropTypes.func.isRequired,
  firstField: PropTypes.array.isRequired,
  setFirstField: PropTypes.func.isRequired,
  secondField: PropTypes.array.isRequired,
  setSecondField: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired
};

export default memo(TicketCard);
