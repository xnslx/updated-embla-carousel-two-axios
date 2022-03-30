import React, { useState, useEffect, useCallback } from "react";
import { PrevButton, NextButton } from "./EmblaCarouselButtons";
import useEmblaCarousel from "embla-carousel-react";
import { useNestedEmblaCarousel } from "./useNestedEmblaCarousel";
import "../css/embla.css";
import { List } from "../media/index";

const NestedCarousel = ({ slides, setLockParentScroll }) => {
  const [viewportRef, embla] = useEmblaCarousel({
    axis: "y",
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const onSelect = useCallback(() => {
    if (!embla) return;
    setSelectedIndex(embla.selectedScrollSnap());
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla, setSelectedIndex]);

  const scrollTo = useCallback(
    (index) => {
      embla && embla.scrollTo(index);
    },
    [embla]
  );

  useEffect(() => {
    if (!embla) return;
    onSelect();
    setScrollSnaps(embla.scrollSnapList());
    embla.on("select", onSelect);
  }, [embla, onSelect, setScrollSnaps]);

  return (
    <>
      <div className="embla__nested">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container__nested">
            {slides.map((s, index) => {
              // return <img className="" src={s} alt="A cool cat." key={index} />;
              return (
                <div className="embla__slide__nested" key={index}>
                  <div className="embla__slide__inner__nested">
                    <img
                      className="embla__slide__img__nested"
                      src={s}
                      alt="A cool cat."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="embla__dots">
        {scrollSnaps.map((_, index) => {
          return (
            <DotButton
              key={index}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
            />
          );
        })}
      </div>
    </>
  );
};

const EmblaCarousel = () => {
  const [viewportRef, embla] = useEmblaCarousel();
  const setLockParentScroll = useNestedEmblaCarousel(embla);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);
  const onSelect = useCallback(() => {
    if (!embla) return;
    setPrevBtnEnabled(embla.canScrollPrev());
    setNextBtnEnabled(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on("select", onSelect);
    onSelect();
  }, [embla, onSelect]);

  return (
    <>
      <div className="embla">
        <div className="embla__viewport" ref={viewportRef}>
          <div className="embla__container">
            {List.map((s, index) => {
              return Object.values(s).map((j, index) => {
                return (
                  <div className="embla__slide" key={index}>
                    <div>
                      {Object.keys(s).map((i, index) => {
                        return <span key={index}>{i}</span>;
                      })}
                    </div>
                    <div>
                      <NestedCarousel
                        slides={j}
                        setLockParentScroll={setLockParentScroll}
                      />
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
        <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
        <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
      </div>
    </>
  );
};

export const DotButton = ({ selected, onClick }) => {
  console.log("selected", selected);
  return (
    <button
      className={`embla__dot ${selected ? "is-selected" : ""}`}
      type="button"
      onClick={onClick}
    />
  );
};

export default EmblaCarousel;
