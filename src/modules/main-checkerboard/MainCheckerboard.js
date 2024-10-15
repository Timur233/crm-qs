import SvbElement from '../../components/SvbElement.js';

export default class MainChecherboard extends SvbElement {
    /**
     *
     * @param {*} data
     * @param {object} options
     * @param {boolean} options.editMode
     */
    constructor (data, options) {
        super();

        this.settings = {
            id:        options?.id || null,
            classList: options?.classList || '',
            editMode:  options?.editMode !== undefined ? options.editMode : true,
            columns:   options?.columns || 1,
            rows:      options?.rows || 1
        };

        this.state = {
            headers: [{
                colIndex: 1,
                id:       Math.random(),
                data:     {
                    title: '1'
                }
            }, {
                colIndex: 2,
                id:       Math.random(),
                data:     {
                    title: '2'
                }
            }],
            grid: [
                [{
                    colIndex: 1,
                    rowIndex: 1,
                    id:       Math.random(),
                    data:     {
                        title: 'Первая квартира 50 мать его квадратов'
                    }
                }]
            ]
        };

        this.init();
        this.render();
    }

    init () {
        this.component = SvbElement.create('div', this.settings.id, `main-checkerboard ${this.settings.classList}`);
        this.component.dataset.columnCount = this.settings.columns;
        this.component.dataset.rowCount = this.settings.rows;
        this.controllDropdown = SvbElement.create('div', null, 'main-checkerboard__dropdown');
        this.rootHeader = SvbElement.create(
            'div',
            null,
            'main-checkerboard__header checkerboard-header checkerboard-header--top'
        );
        this.controllButton = SvbElement.create(
            'button',
            null,
            'main-checkerboard__add-button btn btn--primary', `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4 12H20" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>   
        `);

        this.rootHeader.appendChild(this.controllButton);
        this.rootHeader.appendChild(this.controllDropdown);

        this.defaultEvents();
        this.publicMethods();
    }

    defaultEvents () {
        // controll btn click
        this.event('click', this.controllButton, () => {
            this.showDropdown();
        });

        this.event('click', this.controllDropdown, (event) => {
            if (event?.target && event.target.classList.contains('controll-list__add-column')) {
                this.appendColumn();
            }

            if (event?.target && event.target.classList.contains('controll-list__add-row')) {
                this.appendRow();
            }
        });
        // select column/row
        // delete column/row
        // drag column/row
    }

    publicMethods () {
    }

    showDropdown () {
        this.controllDropdown.show();
    }

    hideDropdown () {
        this.controllDropdown.hide();
    }

    updateGridSize () {
        this.component.dataset.columnCount = this.settings.columns;
        this.component.dataset.rowCount = this.settings.rows;
    }

    getCellData (colIndex, rowIndex) {
        return this.state.grid.find((row) => {
            return row.find(cell => cell.colIndex === colIndex && cell.rowIndex === rowIndex);
        });
    }

    updateGridIndexes () {
        for (let rowIndex = this.settings.rows; rowIndex >= 1; rowIndex--) {
            for (let colIndex = this.settings.columns; colIndex >= 1; colIndex--) {
                const cell = this.getCell(colIndex, rowIndex);
                const cellData = this.getCellData(colIndex, rowIndex);

                if (cellData) cellData[0].rowIndex = rowIndex + 1;

                cell.dataset.rowIndex = rowIndex + 1;

                if (cell.setCaption) cell.setCaption(rowIndex);
            }
        }
    }

    appendColumn () {
        const colIndex = this.settings.columns + 1;
        const headerCell = MainChecherboard.createCellElement(
            'div',
            null,
            'main-checkerboard__header checkerboard-header checkerboard-header--top',
            MainChecherboard.headerCellTemplate(colIndex, 0, colIndex),
            colIndex, 0
        );

        this.setCell(colIndex, 0, headerCell);

        for (let index = 1; index <= this.settings.rows; index++) {
            this.renderCell(colIndex, index, {});
        }

        this.settings.columns = this.settings.columns + 1;
        this.updateGridSize();
    }

    appendRow () {
        const rowIndex = 1;
        const headerCell = MainChecherboard.createCellElement(
            'div',
            null,
            'main-checkerboard__header checkerboard-header checkerboard-header--left',
            MainChecherboard.headerCellTemplate(0, rowIndex, rowIndex),
            0, rowIndex
        );

        this.updateGridIndexes();
        this.setCell(this.settings.columns + 1, 0, headerCell);

        this.renderRow(0);

        this.settings.rows = this.settings.rows + 1;
        this.updateGridSize();
    }

    getCell (colIndex, rowIndex) {
        return this.component
            .querySelector(`[data-col-index="${colIndex}"][data-row-index="${rowIndex}"]`);
    }

    setCell (colIndex, rowIndex, cellElement) {
        const prevCell = this.getCell(colIndex - 1, rowIndex);

        prevCell.insertAdjacentElement('afterend', cellElement);
    }

    renderCell (colIndex, rowIndex, cell) {
        const gridCell = MainChecherboard.createCellElement(
            'div',
            null,
            'main-checkerboard__cell checkerboard-cell',
            cell?.data?.title || 'empty',
            colIndex, rowIndex
        );

        this.setCell(colIndex, rowIndex, gridCell);
    }

    renderRow (startRowIndex) {
        const rowIndex = startRowIndex + 1;

        for (let index = 0; index < this.settings.columns; index++) {
            const colIndex = index + 1;
            const cellData = this.getCellData(colIndex, rowIndex);

            if (cellData?.[0]) {
                this.renderCell(colIndex, rowIndex, cellData[0]);
            } else {
                this.renderCell(colIndex, rowIndex, {});
            }
        }
    }

    renderRows () {
        for (let index = 0; index < this.settings.rows; index++) {
            this.renderRow(index);
        }
    }

    renderHeaders () {
        this.component.appendChild(this.rootHeader);

        for (let index = 0; index < this.settings.columns; index++) {
            const header = this.state.headers[index];
            const colIndex = index + 1;
            const headerCell = MainChecherboard.createCellElement(
                'div',
                null,
                'main-checkerboard__header checkerboard-header checkerboard-header--top',
                MainChecherboard.headerCellTemplate(colIndex, 0, header?.data?.title || colIndex),
                colIndex, 0
            );

            headerCell.setCaption = (caption) => {
                const title = headerCell.querySelector('.checkerboard-header__caption');

                title.textContent = caption;
            };

            this.component.appendChild(headerCell);
        }

        for (let index = 0; index < this.settings.rows; index++) {
            // const row = this.state.grid[index];
            const rowIndex = index + 1;
            const headerCell = MainChecherboard.createCellElement(
                'div',
                null,
                'main-checkerboard__header checkerboard-header checkerboard-header--left',
                MainChecherboard.headerCellTemplate(0, rowIndex, rowIndex),
                0, rowIndex
            );

            headerCell.setCaption = (caption) => {
                const title = headerCell.querySelector('.checkerboard-header__caption');

                title.textContent = caption;
            };

            this.component.appendChild(headerCell);
        }
    }

    renderDropdown () {
        const list = SvbElement.create('div', null, 'controll-list', `
            <span class="controll-list__item controll-list__add-column">Добавить столбец</span>    
            <span class="controll-list__item controll-list__add-row">Добавить строку</span>    
        `);

        this.controllDropdown.appendChild(list);
        this.controllDropdown.hide();
    }

    render () {
        this.renderDropdown();
        this.renderHeaders();
        this.renderRows();
    }

    /**
     *
     * @param {number} index column/row index
     * @param {string} caption column/row caption
     * @returns {string}
     */
    static headerCellTemplate (colIndex, rowIndex, caption) {
        return `
            <div class="checkerboard-header__controll">
                <button class="checkerboard-header__remove-btn" data-col-index="${colIndex}" 
                data-row-index="${rowIndex}">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 3.66797L12.5869 10.3514C12.4813 12.0589 12.4285 12.9127 12.0005 13.5266C11.7889 
                        13.83 11.5165 14.0862 11.2005 14.2786C10.5614 14.668 9.706 14.668 7.99513 14.668C6.28208 14.668 
                        5.42553 14.668 4.78603 14.2779C4.46987 14.0851 4.19733 13.8285 3.98579 13.5245C3.55792 12.9097 
                        3.5063 12.0547 3.40307 10.3448L3 3.66797" stroke="#FD4E5D" stroke-linecap="round"/>
                        <path d="M2 3.66536H14M10.7038 3.66536L10.2487 2.72652C9.9464 2.10287 9.7952 1.79104 9.53447 
                        1.59657C9.47667 1.55343 9.4154 1.51506 9.35133 1.48183C9.0626 1.33203 8.71607 1.33203 8.023 
                        1.33203C7.31253 1.33203 6.95733 1.33203 6.66379 1.48811C6.59873 1.5227 6.53665 1.56263 6.47819 
                        1.60748C6.21443 1.80983 6.06709 2.13306 5.77241 2.77954L5.36861 3.66536" stroke="#FD4E5D" 
                        stroke-linecap="round"/>
                        <path d="M6.3335 11V7" stroke="#FD4E5D" stroke-linecap="round"/>
                        <path d="M9.66699 11V7" stroke="#FD4E5D" stroke-linecap="round"/>
                    </svg>
                </button>
                <span class="checkerboard-header__drag-elem" data-col-index="${colIndex}" 
                data-row-index="${rowIndex}">
                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M5 3.99935C5 3.53911 5.3731 3.16602 5.83333 
                        3.16602H5.83757C6.2978 3.16602 6.6709 3.53911 6.6709 3.99935C6.6709 4.45959 6.2978 4.83268 
                        5.83757 4.83268H5.83333C5.3731 4.83268 5 4.45959 5 3.99935ZM10.3291 3.99935C10.3291 3.53911 
                        10.7022 3.16602 11.1625 3.16602H11.1667C11.6269 3.16602 12 3.53911 12 3.99935C12 4.45959 
                        11.6269 4.83268 11.1667 4.83268H11.1625C10.7022 4.83268 10.3291 4.45959 10.3291 3.99935ZM5 
                        7.99935C5 7.53911 5.3731 7.16602 5.83333 7.16602H5.83757C6.2978 7.16602 6.6709 7.53911 6.6709 
                        7.99935C6.6709 8.45959 6.2978 8.83268 5.83757 8.83268H5.83333C5.3731 8.83268 5 8.45959 5 
                        7.99935ZM10.3291 7.99935C10.3291 7.53911 10.7022 7.16602 11.1625 7.16602H11.1667C11.6269 
                        7.16602 12 7.53911 12 7.99935C12 8.45959 11.6269 8.83268 11.1667 8.83268H11.1625C10.7022 
                        8.83268 10.3291 8.45959 10.3291 7.99935ZM5 11.9993C5 11.5391 5.3731 11.166 5.83333 
                        11.166H5.83757C6.2978 11.166 6.6709 11.5391 6.6709 11.9993C6.6709 12.4596 6.2978 12.8327 
                        5.83757 12.8327H5.83333C5.3731 12.8327 5 12.4596 5 11.9993ZM10.3291 11.9993C10.3291 11.5391 
                        10.7022 11.166 11.1625 11.166H11.1667C11.6269 11.166 12 11.5391 12 11.9993C12 12.4596 11.6269 
                        12.8327 11.1667 12.8327H11.1625C10.7022 12.8327 10.3291 12.4596 10.3291 11.9993Z" 
                        fill="#6B7A80"/>
                    </svg>
                </span>
                <input class="checkerboard-header__select" type="checkbox" data-col-index="${colIndex}" 
                data-row-index="${rowIndex}">
            </div>
            <div class="checkerboard-header__caption">${caption}</div>
        `;
    }

    static createCellElement (tag, id = null, classList = null, innerHTML = null, colIndex = 0, rowIndex = 0) {
        const element = SvbElement.create(tag, id, classList, innerHTML);

        element.dataset.colIndex = colIndex;
        element.dataset.rowIndex = rowIndex;

        return element;
    }
}
