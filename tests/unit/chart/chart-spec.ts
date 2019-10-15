import { Chart, LAYER } from '../../../src/';
import { ViewLifeCircle } from '../../../src/constant';
import { Canvas, Group } from '../../../src/dependents';
import { createDiv } from '../../util/dom';

const data = [
  { city: '杭州', sale: 100, category: '电脑' },
  { city: '广州', sale: 30, category: '电脑' },
  { city: '上海', sale: 110, category: '电脑' },
  { city: '呼和浩特', sale: 40, category: '电脑' },
  { city: '上海', sale: 200, category: '鼠标' },
  { city: '呼和浩特', sale: 10, category: '鼠标' },
  { city: '杭州', sale: 40, category: '鼠标' },
  { city: '广州', sale: 90, category: '鼠标' },
];

describe('Chart', () => {
  const div = createDiv();

  const chart = new Chart({
    container: div,
    width: 800,
    height: 600,
    padding: 10,
  });

  chart.data(data);

  chart
    // @ts-ignore
    .interval()
    .position('city*sale')
    .color('category');

  it('constructor', () => {
    expect(chart.width).toEqual(800);
    expect(chart.height).toEqual(600);
    expect(chart.canvas).toBeInstanceOf(Canvas);

    expect(chart.getLayer(LAYER.BG)).toBeInstanceOf(Group);
    expect(chart.getLayer(LAYER.MID)).toBeInstanceOf(Group);
    expect(chart.getLayer(LAYER.FORE)).toBeInstanceOf(Group);

    // region -> view bbox
    expect({
      x: chart.viewBBox.x,
      y: chart.viewBBox.y,
      width: chart.viewBBox.width,
      height: chart.viewBBox.height,
    }).toEqual({
      x: 10,
      y: 10,
      width: 780,
      height: 580,
    });
  });

  it('render', () => {
    const renderEvent = jest.fn();
    chart.on(ViewLifeCircle.BEFORE_RENDER, renderEvent);
    chart.on(ViewLifeCircle.AFTER_RENDER, renderEvent);

    chart.render();
    expect(renderEvent).toBeCalledTimes(2);

    expect(chart.getLayer(LAYER.BG).get('children').length).not.toBe(0);
    expect(chart.getLayer(LAYER.MID).get('children').length).not.toBe(0);
    expect(chart.getLayer(LAYER.FORE).get('children').length).not.toBe(0);
  });

  it('clear', () => {
    const clearEvent = jest.fn();
    chart.on(ViewLifeCircle.BEFORE_CLEAR, clearEvent);
    chart.on(ViewLifeCircle.AFTER_CLEAR, clearEvent);

    chart.clear();
    expect(clearEvent).toBeCalledTimes(2);

    // @ts-ignore
    expect(chart.filteredData).toEqual([]);
    // @ts-ignore
    expect(chart.scales).toEqual({});
    expect(!!chart.getCoordinate()).toBe(false);

    expect(chart.getLayer(LAYER.BG).get('children').length).toBe(0);
    // FIXME Geometry.destroy do not remove the container
    // expect(chart.getLayer(LAYER.MID).get('children').length).toBe(0);
    expect(chart.getLayer(LAYER.FORE).get('children').length).toBe(0);
  });

  it('destroy', () => {
    const destroyEvent = jest.fn();
    chart.on(ViewLifeCircle.BEFORE_DESTROY, destroyEvent);

    chart.destroy();
    expect(destroyEvent).toBeCalledTimes(1);

    expect(chart.canvas.destroyed).toBe(true);
  });
});